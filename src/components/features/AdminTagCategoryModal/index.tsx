import { type RefObject } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal, { type ModalRef } from "@/components/shared/Modal";

interface FormState {
  name: string;
  slug: string;
  isActive?: boolean;
  sortOrder?: number;
}

interface AdminTagCategoryModalProps {
  modalRef: RefObject<ModalRef | null>;
  modalType: "create" | "edit";
  formData: FormState;
  formErrors: Record<string, string | undefined>;
  onChange: (field: string, value: string | boolean | number) => void;
  onSubmit: () => Promise<boolean>;
  onClose: () => void;
  entityName: string;
  showSortOrder?: boolean;
}

const AdminTagCategoryModal = ({
  modalRef,
  modalType,
  formData,
  formErrors,
  onChange,
  onSubmit,
  onClose,
  entityName,
  showSortOrder,
}: AdminTagCategoryModalProps) => (
  <Modal
    ref={modalRef}
    title={modalType === "edit" ? `編輯${entityName}` : `新增${entityName}`}
    confirmText={modalType === "edit" ? "更新" : "新增"}
    onConfirm={onSubmit}
    onClose={onClose}
    width="max-w-lg"
  >
    <div className="space-y-4">
      <Input
        label="名稱"
        value={formData.name}
        onChange={(e) => onChange("name", e.target.value)}
        error={formErrors.name}
        required
      />
      <Input
        label="Slug"
        value={formData.slug}
        onChange={(e) => onChange("slug", e.target.value)}
        error={formErrors.slug}
        placeholder="英數小寫"
        required
      />
      {showSortOrder && (
        <Input
          label="顯示順序"
          type="number"
          value={String(formData.sortOrder ?? 0)}
          onChange={(e) => onChange("sortOrder", parseInt(e.target.value) || 0)}
        />
      )}
      <Select
        name="isActive"
        label="狀態"
        value={formData.isActive ? "true" : "false"}
        options={[
          { label: "啟用", value: "true" },
          { label: "停用", value: "false" },
        ]}
        onChange={(_, value) => onChange("isActive", value === "true")}
      />
    </div>
  </Modal>
);

export default AdminTagCategoryModal;
