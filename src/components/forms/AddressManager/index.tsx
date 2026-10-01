import { useState } from "react";
import {
  useForm,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import { useAlert } from "@/context/AlertContext";
import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "@/store/api/apiAddresses";
import type { UserAddress } from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getResponseMessage } from "@/utils/getResponseMessage";

const addressSchema = z.object({
  label: z.string().min(1, ""),
  name: z.string().min(1, ""),
  phone: z.string().regex(/^09\d{8}$/, "請輸入手機號碼 09xxxxxxxx"),
  address: z.string().min(1, ""),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFieldsProps {
  register: UseFormRegister<AddressFormData>;
  errors: FieldErrors<AddressFormData>;
  isDefaultDisabled?: boolean; // 是否禁用「設為預設地址」選項
}

interface AddressCardProps {
  addr: UserAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

const AddressFields = ({
  register,
  errors,
  isDefaultDisabled = false,
}: AddressFieldsProps) => (
  <div className="space-y-3">
    <Input
      {...register("label")}
      label="地址標籤"
      placeholder="例如：家裡、公司"
      error={errors.label?.message}
      invalid={!!errors.label}
    />
    <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">
      <Input
        {...register("name")}
        label="收件人姓名"
        placeholder="請填寫姓名"
        error={errors.name?.message}
        invalid={!!errors.name}
      />
      <Input
        {...register("phone")}
        type="tel"
        label="聯絡電話"
        placeholder="0912345678"
        error={errors.phone?.message}
        invalid={!!errors.phone}
      />
    </div>
    <Input
      {...register("address")}
      label="詳細地址"
      placeholder="請填寫完整地址"
      error={errors.address?.message}
      invalid={!!errors.address}
    />
    <Checkbox
      {...register("isDefault")}
      id="isDefault"
      label="設為預設地址"
      disabled={isDefaultDisabled}
    />
  </div>
);

const AddressCard = ({
  addr,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) => (
  <div className="space-y-2 rounded border p-4">
    <div className="flex items-start justify-between">
      <div>
        <span className="font-medium">{addr.label}</span>
        {addr.isDefault && (
          <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
            預設
          </span>
        )}
      </div>
      <div className="flex gap-1">
        <Button variant="link" className="text-xs" onClick={onEdit}>
          編輯
        </Button>
        <Button
          variant="link"
          className="text-xs text-red-600"
          onClick={onDelete}
        >
          刪除
        </Button>
      </div>
    </div>
    <p className="text-sm">
      {addr.name} / {addr.phone}
    </p>
    <p className="text-sm text-gray-600">{addr.address}</p>
    {!addr.isDefault && (
      <Button variant="secondary" className="text-xs" onClick={onSetDefault}>
        設為預設
      </Button>
    )}
  </div>
);

const AddressManager = () => {
  const { showAlert } = useAlert();
  const { data: addrData, isLoading } = useGetAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      name: "",
      phone: "",
      address: "",
      isDefault: false,
    },
  });

  // null = 無表單, "add" = 新增模式, addr._id = 編輯模式
  const [editingId, setEditingId] = useState<string | null>(null);

  const addresses: UserAddress[] = addrData?.addresses ?? [];

  const onSubmit = async (data: AddressFormData) => {
    if (editingId && editingId !== "add") {
      try {
        await updateAddress({ addressId: editingId, data }).unwrap();
        showAlert({ variant: "success", message: "地址已更新" });
        setEditingId(null);
      } catch (err: unknown) {
        showAlert({
          variant: "error",
          message: getErrorMessage(err, "更新失敗，請稍後再試。"),
        });
      }
    } else {
      try {
        await addAddress(data).unwrap();
        showAlert({ variant: "success", message: "地址已新增" });
        reset();
        setEditingId(null);
      } catch (err: unknown) {
        showAlert({
          variant: "error",
          message: getErrorMessage(err, "新增失敗，請稍後再試。"),
        });
      }
    }
  };

  // 編輯模式時，將表單重置為該地址的資料。
  const startEdit = (addr: UserAddress) => {
    reset({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      isDefault: addr.isDefault,
    });
    setEditingId(addr._id);
  };

  const handleDelete = async (addressId: string) => {
    try {
      const result = await deleteAddress(addressId).unwrap();
      showAlert({
        variant: "success",
        message: getResponseMessage(result, "地址已刪除"),
      });
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "刪除失敗，請稍後再試。"),
      });
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await updateAddress({ addressId, data: { isDefault: true } }).unwrap();
      showAlert({ variant: "success", message: "已設為預設地址" });
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "設定失敗，請稍後再試。"),
      });
    }
  };

  if (isLoading)
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4">
            <div className="flex justify-between">
              <div className="h-5 w-24 skeleton" />
              <div className="h-5 w-16 skeleton" />
            </div>
            <div className="h-4 w-3/4 skeleton" />
            <div className="h-4 w-1/2 skeleton" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex-between">
        <h4 className="font-medium">我的地址</h4>
        <Button
          variant="secondary"
          className="text-sm"
          onClick={() =>
            editingId === "add"
              ? setEditingId(null)
              : (reset({
                  label: "",
                  name: "",
                  phone: "",
                  address: "",
                  isDefault: addresses.length === 0,
                }),
                setEditingId("add"))
          }
        >
          {editingId === "add" ? "取消" : "新增地址"}
        </Button>
      </div>
      {editingId === "add" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 rounded border p-4"
          noValidate
        >
          <AddressFields
            register={register}
            errors={errors}
            isDefaultDisabled={addresses.length === 0}
          />
          <Button type="submit" disabled={isAdding} className="w-full">
            {isAdding ? "新增中..." : "新增地址"}
          </Button>
        </form>
      )}
      {addresses.length === 0 ? (
        <p className="text-sm text-gray-500">尚未新增任何地址</p>
      ) : (
        addresses.map((addr) => (
          <div key={addr._id}>
            {editingId === addr._id ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3 rounded border p-4"
                noValidate
              >
                <AddressFields
                  register={register}
                  errors={errors}
                  isDefaultDisabled={addr.isDefault}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1"
                  >
                    {isUpdating ? "儲存中..." : "儲存"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEditingId(null)}
                    className="flex-1"
                  >
                    取消
                  </Button>
                </div>
              </form>
            ) : (
              <AddressCard
                addr={addr}
                onEdit={() => startEdit(addr)}
                onDelete={() => handleDelete(addr._id)}
                onSetDefault={() => handleSetDefault(addr._id)}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AddressManager;
