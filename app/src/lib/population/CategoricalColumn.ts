import { Column } from './Column';

export class CategoricalColumn extends Column {
  private readonly indexes: (number | null)[] = [];
  private readonly theCategories: string[] = [];

  constructor(name: string, rawValues: (string | null)[]) {
    super(name);
    this.theCategories = Array.from(
      new Set(rawValues.filter(value => !!value))
    ).sort() as string[];
    this.indexes = rawValues.map(value => {
      return !value ? null : this.theCategories.indexOf(value);
    });
  }

  length(): number {
    return this.indexes.length;
  }

  mean(): number {
    throw new Error('no mean for Categorical column');
  }

  sum(): number {
    throw new Error('no sum for Categorical column');
  }

  /** copy of values */
  values(): (string | null)[] {
    return this.indexes.map(index => {
      return index !== null ? this.theCategories[index as number] : null;
    });
  }

  /** copy of categories */
  categories(): string[] {
    return [...this.theCategories];
  }

  fromRowIndexes(indexes: number[]): Column {
    const newValues = indexes.map(rowIndex => {
      const categoryIndex = this.indexes[rowIndex];
      return categoryIndex !== null
        ? this.theCategories[categoryIndex as number]
        : null;
    });

    return new CategoricalColumn(this.name(), newValues);
  }

  bind(bottom: Column): Column {
    const bottomCC = bottom as CategoricalColumn;
    return new CategoricalColumn(name, this.values().concat(bottomCC.values()));
  }
}
