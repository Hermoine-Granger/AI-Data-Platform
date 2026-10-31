from collections.abc import Sequence
import json
import tempfile
from pathlib import Path

import apache_beam as beam

DEFAULT_INPUT = [
        "apple banana apple",
        "banana cherry",
        "apple cherry cherry"
    ]

def run_batch(lines: Sequence[str] | None = None) -> tuple[dict[str, int], int]:
    batch_input = list(lines) if lines is not None else DEFAULT_INPUT
    with tempfile.TemporaryDirectory() as temporary_directory:
        output_path = str(Path(temporary_directory) / "word-counts")
        with beam.Pipeline() as pipeline:
            (
                pipeline
                | "Dummy Source" >> beam.Create(batch_input)
                | "Split Words" >> beam.FlatMap(lambda line: line.split())
                | "Pair with 1" >> beam.Map(lambda word: (word, 1))
                | "Group and Sum" >> beam.CombinePerKey(sum)
                | "Format Results" >> beam.Map(json.dumps)
                | "Dummy Sink" >> beam.io.WriteToText(output_path, shard_name_template="")
            )

        counts = {}
        with Path(output_path).open() as output_file:
            for line in output_file:
                word, count = json.loads(line)
                counts[word] = count
    return counts, sum(counts.values())

if __name__ == "__main__":
    counts, _ = run_batch()
    for word, count in sorted(counts.items()):
        print(word, count)
