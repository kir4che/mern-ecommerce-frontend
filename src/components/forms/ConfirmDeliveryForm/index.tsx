import CopyButton from "@/components/shared/CopyButton";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { Order } from "@/types";

interface ConfirmDeliveryFormProps {
  order: Partial<Order>;
  shippingTrackingNo: string;
  setShippingTrackingNo: (value: string) => void;
  shippingCarrier: string;
  setShippingCarrier: (value: string) => void;
}

const ConfirmDeliveryForm = ({
  order,
  shippingTrackingNo,
  setShippingTrackingNo,
  shippingCarrier,
  setShippingCarrier,
}: ConfirmDeliveryFormProps) => (
  <div className="space-y-4 pb-8">
    <div className="space-y-2 pb-2">
      <p className="flex flex-wrap items-center gap-2 text-base">
        <span className="font-mono">{order?.orderNo}</span>
        <CopyButton text={order?.orderNo ?? ""} label="訂單編號" />
      </p>
      <div className="rounded-md bg-gray-50 p-3">
        <p className="mb-1 text-sm font-medium text-gray-600">購買明細：</p>
        <ul className="list-disc pl-4 text-sm leading-6 text-gray-700">
          {order?.orderItems?.map((item) => (
            <li key={item._id || item.productId}>
              {item.title}{" "}
              <span className="text-gray-400">x {item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="border-y border-gray-100 py-4">
      <p className="mb-2 text-sm font-medium text-gray-600">收件資訊：</p>
      <ul className="space-y-2 text-sm text-gray-700">
        <li>收件人：{order?.name}</li>
        <li>聯絡電話：{order?.phone}</li>
        <li className="flex items-start gap-2">
          配送地址：{order?.address}
          <CopyButton text={order?.address ?? ""} label="配送地址" />
        </li>
      </ul>
    </div>
    <div className="space-y-3 pt-2">
      <Select
        name="shippingCarrier"
        label="物流公司"
        value={shippingCarrier}
        options={[
          { label: "黑貓宅急便", value: "黑貓宅急便" },
          { label: "新竹物流", value: "新竹物流" },
          { label: "宅配通", value: "宅配通" },
        ]}
        onChange={(_, value) => setShippingCarrier(value as string)}
      />
      <Input
        id="shippingTrackingNo"
        value={shippingTrackingNo}
        label="配送單號"
        placeholder="請輸入物流單號"
        onChange={(e) => setShippingTrackingNo(e.target.value)}
      />
    </div>
  </div>
);

export default ConfirmDeliveryForm;
