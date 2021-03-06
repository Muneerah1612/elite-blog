import React, { useState, useEffect } from "react";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";

export default function BlogPreview(props) {
  const [convertedContent, setConvertedContent] = useState(null);
  useEffect(() => {
    setConvertedContent(draftToHtml(props.content));
  }, []);

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const back = () => {
    props.back("create");
  };
  return (
    <div>
      <div className="my-6 mx-4 md:mx-24">
        <button
          className="bg-purple text-lg text-white font-medium py-3 px-10 rounded-md"
          onClick={back}
        >
          Back
        </button>
      </div>
      <div
        className="h-[23.75rem] mx-4 md:mx-24 bg-light-purple rounded-md"
        style={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundImage: `url(${props.cover})`,
        }}
      ></div>
      <div className="mx-4 md:mx-48 mt-10">
        <div className="border-b pb-7">
          <h1 className="font-bold text-app-black text-2xl md:text-5xl">
            {props.title}
          </h1>
          <p className="text-app-black text-base md:text-lg font-bold mt-5">
            Written by <span className="capitalize">{props.username}</span>
          </p>
        </div>
        <div className="mt-8">
          <div dangerouslySetInnerHTML={createMarkup(convertedContent)}></div>
        </div>
      </div>
      <div className="flex justify-end my-6 mx-24">
        <button
          className="bg-purple text-lg text-white font-medium py-3 px-10 rounded-md"
          onClick={back}
        >
          Back
        </button>
      </div>
    </div>
  );
}
