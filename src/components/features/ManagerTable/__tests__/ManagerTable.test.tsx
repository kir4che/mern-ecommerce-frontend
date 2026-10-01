import { screen } from "@testing-library/react";
import { vi } from "vitest";
import ManagerTable from "@/components/features/ManagerTable";
import { render } from "@/test/utils";

interface TestItem {
  _id: string;
  name: string;
  price: number;
}

const columns = [
  { key: "name" as const, label: "名稱" },
  { key: "price" as const, label: "價格", sortable: true },
];

const data: TestItem[] = [
  { _id: "1", name: "商品A", price: 100 },
  { _id: "2", name: "商品B", price: 200 },
];

describe("ManagerTable 元件", () => {
  it("資料為空時顯示 emptyMessage", () => {
    render(<ManagerTable columns={columns} data={[]} emptyMessage="無資料" />);
    expect(screen.getByText("無資料")).toBeInTheDocument();
  });

  it("sortable 欄位點擊觸發 onSort", async () => {
    const onSort = vi.fn();
    const { user } = render(
      <ManagerTable
        columns={columns}
        data={data}
        onSort={onSort}
        sortKey="price"
        sortOrder="asc"
      />
    );
    await user.click(screen.getByText("價格"));
    expect(onSort).toHaveBeenCalledWith("price", "desc");
  });

  it("renderRowActions 顯示操作按鈕", () => {
    render(
      <ManagerTable
        columns={columns}
        data={data}
        renderRowActions={(row) => <button type="button">{row._id}</button>}
      />
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
