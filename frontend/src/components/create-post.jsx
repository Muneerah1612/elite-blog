import React, { useState } from "react";
import SideBar from "./side-bar";
import UserInfo from "./user-info";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import BlogPreview from "./blog-preview";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ApiService from "../service";
import classes from "./button.module.css";
import MobileNav from "./mobile-nav";

export default function CreatePost() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [currentStep, setCurrentStep] = useState("create");
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const user = localStorage.getItem("address");
  function previewHandler() {
    setCurrentStep("preview");
  }

  const coverImageHandler = (e) => {
    setCoverImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };
  let navigate = useNavigate();

  const submitBlog = async (e) => {
    e.preventDefault();
    const rawData = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    if (!editorState.getCurrentContent().hasText()) {
      Swal.fire({
        icon: "error",
        title: `You can't post an empty Article`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (!file) {
      Swal.fire({
        icon: "error",
        title: `Please Upload a cover Image`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const currentUser = localStorage.getItem("address");
    if (!currentUser) {
      Swal.fire({
        icon: "error",
        title: `Please Login`,
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
      return;
    }
    const form = new FormData();
    form.append("image", file);
    form.append("title", title);
    form.append("bodyContent", rawData);
    form.append("author", currentUser);
    form.append("username", username);

    try {
      setLoading(true);
      const response = await ApiService.post("/articles/create-article", form);
      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: `Article Created Successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false);
        navigate(`/blog/${response.data.data._id}`);
      } else {
        Swal.fire({
          icon: "error",
          title: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.response);
    }
  };

  return (
    <div>
      {currentStep === "preview" && (
        <BlogPreview
          title={title}
          content={convertToRaw(editorState.getCurrentContent())}
          author={user}
          back={setCurrentStep}
          cover={coverImage}
          username={username}
        />
      )}
      {currentStep === "create" && (
        <div className="p-4 md:p-[1.875rem]">
          <SideBar />
          <div className="md:ml-80 md:pl-10">
            <div className="hidden md:flex justify-end">
              <UserInfo />
            </div>
            <MobileNav />
            <div className="mt-12 mb-11">
              <p className="text-2xl text-app-black">Create Blog</p>
              <p className="text-base text-app-black opacity-40">
                Home / Create Blog
              </p>
            </div>
            <div className="">
              <form onSubmit={submitBlog}>
                <div className="flex flex-col">
                  <label className="text-lg font-medium">Blog Title</label>
                  <input
                    type={"text"}
                    className={`border border-app-black text-base p-2 text-app-black rounded-md mb-1 md:w-[80%] font-medium`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <label className="text-lg font-medium">Username</label>
                  <input
                    type={"text"}
                    className={`border border-app-black text-base p-2 text-app-black rounded-md mb-1 md:w-[80%] font-medium`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col my-4">
                  <label className="text-lg font-medium">Cover Image</label>
                  <input
                    type={"file"}
                    className={`border border-app-black text-base p-2 text-app-black rounded-md mb-1 md:w-[80%]`}
                    accept="image/*"
                    onChange={(e) => coverImageHandler(e)}
                  />
                </div>
                <div className="flex flex-col my-4">
                  <label className="text-lg font-medium">Blog Content</label>
                  <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    wrapperStyle={{
                      boxShadow: "none",
                      border: "1px solid #e3e6ea",
                      borderRadius: "10px",
                      //   backgroundColor: "#fafafa",
                      minHeight: "19rem",
                      padding: "1em",
                    }}
                    onEditorStateChange={onEditorStateChange}
                  />
                </div>
                <div className="flex items-center justify-end mb-8">
                  <button
                    className={`bg-purple py-3 font-medium border border-purple px-9 text-white rounded-md mr-8 relative ${
                      loading ? classes.button__loading : ""
                    }`}
                  >
                    <span className={`${classes.button__text}`}>Publish</span>
                  </button>
                  <button
                    className="py-3 px-9 bg-light-purple rounded-md text-purple font-medium border border-purple relative"
                    onClick={previewHandler}
                  >
                    Preview
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
