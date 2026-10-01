import { Link, useSearchParams } from "react-router";
import removeMarkdown from "remove-markdown";

import { useGetNewsQuery } from "@/store/api/apiNews";
import { formatDate } from "@/utils/formatDate";
import { getErrorMessage } from "@/utils/getErrorMessage";

import PageHeader from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import NotFound from "@/pages/notFound";

interface NewsItemProps {
  _id: string;
  date: string | Date;
  category: string;
  title: string;
  content: string;
}

const NewsItem = ({ _id, date, category, title, content }: NewsItemProps) => (
  <li className="group border-b border-slate-200 py-6 transition-colors last:border-0 hover:bg-slate-50/50">
    <Link to={`/news/${_id}`} className="block space-y-3">
      <div className="flex items-center gap-2.5">
        <time className="text-sm font-light text-gray-600">
          {formatDate(date)}
        </time>
        <span className="badge rounded-full px-2 text-xs text-nowrap badge-neutral">
          {category}
        </span>
      </div>
      <h3 className="text-xl leading-snug font-semibold transition-colors group-hover:text-primary md:text-2xl">
        {title}
      </h3>
      <p className="line-clamp-3 text-sm text-gray-600">
        {removeMarkdown(content)}
      </p>
    </Link>
  </li>
);

const News = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 25;

  const { data, error, isLoading } = useGetNewsQuery({ page, limit });

  const newsList = data?.news ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages)
      setSearchParams({ page: String(newPage) });
  };

  if (isLoading)
    return (
      <>
        <PageHeader
          breadcrumbText="最新消息"
          titleEn="News"
          titleCh="最新消息"
        />
        <div className="mx-auto w-full max-w-4xl p-5 md:px-8">
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="border-b border-slate-200 py-6 last:border-0"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-4 w-24 shrink-0 skeleton" />
                    <div className="h-5 w-16 shrink-0 skeleton rounded-full" />
                  </div>
                  <div className="h-6 w-3/4 skeleton" />
                  <div className="h-4 w-full skeleton" />
                  <div className="h-4 w-5/6 skeleton" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );

  if (error) {
    const status = (error as { status?: number })?.status;
    const errorType = status === 404 ? "not-found" : "network-error";

    return (
      <NotFound
        type={errorType}
        message={getErrorMessage(error, "載入最新消息失敗")}
      />
    );
  }

  return (
    <>
      <PageHeader breadcrumbText="最新消息" titleEn="News" titleCh="最新消息" />
      <div className="mx-auto max-w-4xl p-5 md:px-8">
        <ul className="divide-y divide-slate-100">
          {newsList.map((news) => (
            <NewsItem key={news._id} {...news} />
          ))}
        </ul>
        {total > limit && (
          <Pagination
            page={page}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default News;
