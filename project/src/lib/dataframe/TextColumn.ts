import { Column } from './Column';
import { ColumnSummary } from './ColumnSummary';
import { Value, ValueMutator, ValuePredicate } from './Types';

export class TextColumn extends Column {
  private theValues: (string | null)[];

  constructor(name: string, values: (string | null)[]) {
    super(name);
    this.theValues = values;
  }

  /** copy of values */
  values(): (string | null)[] {
    return [...this.theValues];
  }

  value(index: number): string | null {
    return this.theValues[index];
  }

  length(): number {
    return this.theValues.length;
  }

  fromRowIndexes(indexes: number[]): Column {
    const newValues = indexes.map(index => {
      return this.theValues[index];
    });

    return new TextColumn(this.name(), newValues);
  }

  bind(bottom: Column): Column {
    const bottomTC = bottom as TextColumn;
    return new TextColumn(this.name(), this.values().concat(bottomTC.values()));
  }

  summary(): ColumnSummary {
    return {
      name: this.name(),
    };
  }

  mutate(predicate: ValuePredicate, mutator: ValueMutator): void {
    this.theValues = this.theValues.map(value => {
      const mutated = predicate(value) ? mutator(value) : value;
      return mutated as string | null;
    });
  }

  mean(): number {
    throw new Error('no mean for Text column');
  }

  min(): number {
    throw new Error('no min for Text column');
  }

  max(): number {
    throw new Error('no max for Text column');
  }

  sum(): number {
    throw new Error('no sum for Text column');
  }

  categories(): string[] {
    throw new Error('no categories for Text column');
  }

  median(): number {
    throw new Error('no median for Text column');
  }

  percentile(rawRatio: number): number {
    throw new Error('no percentile for Text column');
  }
}
