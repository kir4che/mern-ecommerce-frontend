import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useAlert } from "@/context/AlertContext";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import {
  useCreateNewsMutation,
  useUpdateNewsMutation,
} from "@/store/api/apiNews";
import type { NewsItem } from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getResponseMessage } from "@/utils/getResponseMessage";

export const newsSchema = z.object({
  title: z.string().min(1, { message: "請輸入標題" }),
  category: z.string().min(1, { message: "請選擇分類" }),
  date: z.string().min(1, { message: "請選擇日期" }),
  content: z.string().min(1, { message: "請輸入內容" }),
  imageUrl: z.string().optional().default(""),
});

interface NewsFormProps {
  news?: NewsItem;
}

const NewsForm = ({ news }: NewsFormProps) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [createNews] = useCreateNewsMutation();
  const [updateNews] = useUpdateNewsMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: news?.title ?? "",
      category: news?.category ?? "",
      date: news?.date ? new Date(news.date).toISOString().slice(0, 10) : "",
      content: news?.content ?? "",
      imageUrl: news?.imageUrl ?? "",
    },
  });

  const { markSaved } = useUnsavedChanges(isDirty);

  const fillTestData = () => {
    const testData = {
      title: "中秋月餅禮盒預購開跑",
      category: "活動",
      date: new Date().toISOString().slice(0, 10),
      content:
        "### 中秋月餅禮盒預購中\n\n即日起至 9/15 前預購享早鳥 9 折優惠。\n\n- 經典蛋黃酥 6 入 $420\n- 芋頭酥 6 入 $380\n- 綜合禮盒 12 入 $780\n\n數量有限，售完為止。",
      imageUrl: "",
    };

    setValue("title", testData.title, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("category", testData.category, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("date", testData.date, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("content", testData.content, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("imageUrl", testData.imageUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: z.infer<typeof newsSchema>) => {
    try {
      if (news) {
        const result = await updateNews({ id: news._id, ...data }).unwrap();
        showAlert({
          variant: "success",
          message: getResponseMessage(result, "更新成功"),
        });
      } else {
        const result = await createNews(data).unwrap();
        showAlert({
          variant: "success",
          message: getResponseMessage(result, "新增成功"),
        });
      }
      reset(data);
      markSaved();
      navigate("/admin/news");
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "操作失敗"),
      });
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {news ? "編輯公告" : "新增公告"}
        </h1>
        <div className="flex items-center gap-2">
          <Button type="submit" form="news-form" disabled={isSubmitting}>
            {isSubmitting ? "儲存中..." : news ? "更新" : "新增"}
          </Button>
          <Button variant="secondary" onClick={() => navigate("/admin/news")}>
            取消
          </Button>
        </div>
      </div>
      <div className="-mb-4 flex justify-end">
        <Button variant="link" onClick={fillTestData} className="text-sm">
          貼上測試資料
        </Button>
      </div>
      <form
        id="news-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Input
          label="標題"
          {...register("title")}
          error={errors.title?.message}
          invalid={!!errors.title}
          required
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="分類"
                onChange={(_, value) => field.onChange(value)}
                required
                options={[
                  { label: "活動", value: "活動" },
                  { label: "公告", value: "公告" },
                  { label: "新聞", value: "新聞" },
                ]}
              />
            )}
          />
          <Input
            label="發佈日期"
            type="date"
            {...register("date")}
            error={errors.date?.message}
            invalid={!!errors.date}
            required
          />
        </div>
        <Textarea
          label="內容"
          {...register("content")}
          error={errors.content?.message}
          invalid={!!errors.content}
          rows={20}
          required
          helperText="支援 Markdown 語法"
        />
      </form>
    </div>
  );
};

export default NewsForm;
