export type DataTable = {
  rowKey: string,
  data?: any[],
  columns: any[],
  pagination?: any,
  rowSelection?: any,
  listTab?: any[],
  isLoading?: boolean,
  defaultTab?: string,
  searchPlaceholder?: string,
  scroll?: { x?: number | string | true | undefined, y?: number | string | undefined },
  onSearch?: (e) => void,
  onDelete?: (e) => void,
  onAdd?: (e) => void,
  onChangeTab?: (e) => void
}
