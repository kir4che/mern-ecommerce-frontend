import Accordion from "@/components/shared/Accordion";
import PageHeader from "@/components/shared/PageHeader";
import { FAQ as faqData } from "@/constants/data";

const FAQ = () => (
  <>
    <PageHeader breadcrumbText="常見問題" titleEn="FAQ" titleCh="常見問題" />
    <div className="mx-auto w-full max-w-3xl px-5 py-20 md:px-8">
      <div className="w-full space-y-2">
        {faqData.map(({ question, answer }) => (
          <Accordion
            key={question}
            title={question}
            name="faq"
            defaultOpen={false}
          >
            {answer}
          </Accordion>
        ))}
      </div>
    </div>
  </>
);

export default FAQ;
