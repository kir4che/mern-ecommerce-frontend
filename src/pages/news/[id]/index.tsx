import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router";

import { useGetNewsByIdQuery } from "@/store/api/apiNews";
import { formatDate } from "@/utils/formatDate";
import { getErrorMessage } from "@/utils/getErrorMessage";

import PageHeader from "@/components/shared/PageHeader";
import NotFound from "@/pages/notFound";

import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";

const New = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetNewsByIdQuery(id!, {
    skip: !id,
  });

  const newsItem = data?.newsItem;

  if (isLoading)
    return (
      <>
        <PageHeader
          breadcrumbText="最新消息"
          titleEn="News"
          titleCh="最新消息"
        />
        <div className="mx-auto w-full max-w-5xl space-y-6 p-5 md:px-8">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 skeleton" />
            <div className="h-6 w-3/4 skeleton" />
          </div>
          <div className="h-80 w-full skeleton md:min-h-96" />
          <div className="space-y-3">
            <div className="h-4 w-full skeleton" />
            <div className="h-4 w-11/12 skeleton" />
            <div className="h-4 w-4/5 skeleton" />
            <div className="h-4 w-3/4 skeleton" />
            <div className="h-4 w-full skeleton" />
            <div className="h-4 w-5/6 skeleton" />
          </div>
        </div>
      </>
    );

  if (!newsItem)
    return error ? (
      <NotFound
        type="not-found"
        message={getErrorMessage(error, "無法載入最新消息內容")}
      />
    ) : null;

  return (
    <>
      <PageHeader breadcrumbText="最新消息" titleEn="News" titleCh="最新消息" />
      <article className="mx-auto max-w-5xl px-5 py-10 whitespace-pre-line md:px-8">
        <div className="flex gap-2 border-b border-primary/50 pb-6 max-md:flex-col md:items-center">
          <time className="text-base font-light">
            {formatDate(newsItem.date)}
          </time>
          <hr className="hidden h-0.5 w-8 rotate-90 bg-primary/30 md:block" />
          <h1 className="text-3xl leading-10 font-bold">{newsItem.title}</h1>
        </div>
        <img
          src={newsItem.imageUrl}
          alt={newsItem.title}
          className="mb-4 h-80 w-full object-cover object-center md:h-[24vw] md:min-h-96"
        />
        <div className="rich-text">
          <ReactMarkdown>{newsItem.content}</ReactMarkdown>
        </div>
      </article>
      <div className="w-full border-t border-slate-400 p-5">
        <Link
          to="/news"
          className="flex items-center justify-end gap-2 text-base hover:underline hover:underline-offset-4"
        >
          <ArrowLeftIcon className="size-5" />
          回上一頁
        </Link>
      </div>
    </>
  );
};

export default New;
