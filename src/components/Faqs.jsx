import React, { useState } from "react";

function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How are the medications packaged?",
      answer: "We ensure that the pharmacists package your products in sealed boxes that clearly show whether or not the box has been opened. Refrigerated items are packed between ice gel packs to keep medicine temperatures stable during transit. Our packaging methods are compliant with government regulations."
    },
    {
      id: 2,
      question: "Is it necessary for me to have a valid prescription in order to purchase medicine?",
      answer: "Yes, to purchase medicines through the Niramaya Soul App, you must first upload a valid prescription. However, a prescription is not necessary to buy cosmetics or skincare products. If you've misplaced your medication, our physicians will diagnose and prescribe for you over the phone."
    },
    {
      id: 3,
      question: "How do I know if the medicine I've received is genuine or authentic?",
      answer: "We deliver medicines from authentic companies, and we have a zero-tolerance approach for bad quality. Niramaya Soul only acquires medicines directly from pharmaceutical companies or verified distributors."
    },
    {
      id: 4,
      question: "Are the labs that you partner with certified?",
      answer: "Yes, we only partner with labs or diagnostic centers with an ISO (International Organization for Standardization) Certification. Our partner labs must have all the valid healthcare licenses in order to be listed on our platform."
    },
    {
      id: 5,
      question: "How do I consult doctors?",
      answer: "You will be able to speak with the doctor only through a video/audio consultation after booking an appointment with him. you cannot directly call and talk to a doctor here."
    }
  ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="pt-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="heading text-center mb-70">
                <span className="text-uppercase">FAQ’s</span>
                <h2 className="pb-0">Frequently Asked Questions</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-between">
            <div className="col-lg-6">
              <div className="according">
                <div className="accordion" id="accordionExample">
                  {faqs.map((faq, index) => (
                    <div className="accordion-item" key={faq.id}>
                      <h2 className="accordion-header" id={`heading${faq.id}`}>
                        <button
                          className={`accordion-button d-flex justify-content-between align-items-center ${
                            openIndex === index ? "" : "collapsed"
                          }`}
                          type="button"
                          onClick={() => handleToggle(index)}
                        >
                          {faq.question}
                          <img
                            src="/img/plus.svg"
                            alt="Plus icon"
                            className={`icon ${openIndex === index ? "d-none" : ""}`}
                          />
                          <img
                            src="/img/minus.svg"
                            alt="Minus icon"
                            className={`icon ${openIndex === index ? "" : "d-none"}`}
                          />
                        </button>
                      </h2>
                      <div
                        id={`collapse${faq.id}`}
                        className={`accordion-collapse collapse ${openIndex === index ? "show" : ""}`}
                        aria-labelledby={`heading${faq.id}`}
                        data-mdb-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <p>{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                className="img-fluid w-100 ml-30"
                src="/img/collarge.png"
                alt="FAQ Illustration"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Faqs;
