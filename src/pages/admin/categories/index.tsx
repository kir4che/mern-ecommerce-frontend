import { useRef, useState } from "react";
import { z } from "zod";
import Button from "@/components/ui/Button";
import AdminTagCategoryModal from "@/components/features/AdminTagCategoryModal";
import type { ModalRef } from "@/components/shared/Modal";
import ManagerTable, {
  type TableColumn,
} from "@/components/features/ManagerTable";
import AdminPageHeader from "@/components/shared/AdminPageHeader";
import { useAlert } from "@/context/AlertContext";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/store/api/apiCategories";
import type { Category } from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";
import EditIcon from "@/assets/icons/edit.inline.svg?react";
import PlusIcon from "@/assets/icons/plus.inline.svg?react";
import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";
import CloseIcon from "@/assets/icons/xmark.inline.svg?react";

const categorySchema = z.object({
  name: z.string().trim().min(1, "請輸入名稱"),
  slug: z.string().trim().min(1, "請輸入 Slug"),
});

interface FormState {
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

type FormMode = { type: "create" } | { type: "edit"; target: Category };

const INITIAL_FORM: FormState = {
  name: "",
  slug: "",
  sortOrder: 0,
  isActive: true,
};

const AdminCategoriesPage = () => {
  const { showAlert } = useAlert();
  const { open: openConfirmDialog } = useConfirmDialog();
  const { data, isLoading, error, refetch } = useGetAllCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [mode, setMode] = useState<FormMode>({ type: "create" });
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    slug?: string;
  }>({});

  const modalRef = useRef<ModalRef>(null);

  const categories = data?.categories ?? [];

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setFormErrors({});
  };

  const openCreateModal = () => {
    setMode({ type: "create" });
    resetForm();
    modalRef.current?.showModal();
  };

  const openEditModal = (cat: Category) => {
    setMode({ type: "edit", target: cat });
    setFormData({
      name: cat.name,
      slug: cat.slug,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    });
    modalRef.current?.showModal();
  };

  const handleSubmit = async () => {
    const result = categorySchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string | undefined> = {};

      for (const issue of result.error.issues) {
        if (issue.path.length > 0)
          fieldErrors[issue.path[0] as string] = issue.message;
      }

      setFormErrors(fieldErrors);

      return false;
    }

    setFormErrors({});

    try {
      if (mode.type === "edit") {
        await updateCategory({
          id: mode.target._id,
          data: formData,
        }).unwrap();

        showAlert({ variant: "success", message: "分類已更新" });
      } else {
        await createCategory({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          sortOrder: formData.sortOrder,
          isActive: formData.isActive,
        }).unwrap();

        showAlert({ variant: "success", message: "分類已建立" });
      }

      resetForm();

      return true;
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "操作失敗"),
      });

      return false;
    }
  };

  const handleDelete = (cat: Category) => {
    openConfirmDialog({
      title: "刪除分類",
      message: `確定要刪除分類「${cat.name}」嗎？`,
      confirmText: "刪除",
      cancelText: "取消",
      onConfirm: async () => {
        try {
          await deleteCategory(cat._id).unwrap();
          showAlert({ variant: "success", message: `已刪除 ${cat.name}` });
        } catch (err: unknown) {
          showAlert({
            variant: "error",
            message: getErrorMessage(err, "刪除失敗"),
          });
        }
      },
    });
  };

  const columns: TableColumn<Category>[] = [
    { key: "sortOrder", label: "排序", className: "w-16 text-center" },
    {
      key: "name",
      label: "名稱",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "slug",
      label: "Slug",
      className: "text-gray-500 font-mono text-sm",
    },
    {
      key: "isActive",
      label: "狀態",
      render: (_, row) =>
        row.isActive ? (
          <span className="badge border-none bg-green-600 px-2 py-1 text-xs text-white">
            啟用
          </span>
        ) : (
          <span className="badge border-none bg-gray-400 px-2 py-1 text-xs text-white">
            停用
          </span>
        ),
    },
  ];

  if (error)
    return (
      <>
        <AdminPageHeader title="分類管理" />
        <div className="flex-center h-64 flex-col gap-4">
          <p className="text-gray-600">
            {getErrorMessage(error, "無法載入分類資料")}
          </p>
          <Button onClick={refetch} icon={RefreshIcon}>
            重新載入
          </Button>
        </div>
      </>
    );

  return (
    <>
      <AdminPageHeader
        title="分類管理"
        actions={
          <Button onClick={openCreateModal} icon={PlusIcon} className="h-9">
            新增分類
          </Button>
        }
      />
      <ManagerTable<Category>
        columns={columns}
        data={categories}
        loading={isLoading}
        emptyMessage="尚無分類"
        renderRowActions={(row) => (
          <div className="flex items-center gap-1">
            <Button
              variant="icon"
              icon={EditIcon}
              onClick={() => openEditModal(row)}
              aria-label="編輯分類"
              className="rounded-full hover:bg-gray-50"
            />
            <Button
              variant="icon"
              icon={CloseIcon}
              onClick={() => handleDelete(row)}
              aria-label="刪除分類"
              className="rounded-full text-red-600 hover:bg-red-50"
            />
          </div>
        )}
      />
      <AdminTagCategoryModal
        modalRef={modalRef}
        modalType={mode.type}
        formData={formData}
        formErrors={formErrors}
        onChange={(field, value) =>
          setFormData((p) => ({ ...p, [field]: value }))
        }
        onSubmit={handleSubmit}
        onClose={resetForm}
        entityName="分類"
        showSortOrder
      />
    </>
  );
};

export default AdminCategoriesPage;
