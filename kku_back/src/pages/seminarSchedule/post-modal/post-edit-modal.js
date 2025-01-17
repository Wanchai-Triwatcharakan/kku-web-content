import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { svUpdateSchedule } from "../../../services/post.service";
import ButtonUI from "../../../components/ui/button/button";
import PreviewImageUI from "../../../components/ui/preview-image/preview-image";
import FieldsetUI from "../../../components/ui/fieldset/fieldset";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import CheckBoxUI from "../../../components/ui/check-box/check-box";
import CKeditorComponent from "../../../components/ui/ckeditor/ckeditor";

import "./post-edit-modal.scss";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEdit,
  faMinus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { svGetTimeSchedule } from "../../../services/post.service";
import Checkbox from '@mui/material/Checkbox';

const editDataDefault = {
  id: null,
  thumbnail: "",
  thumbnail_link: "",
  thumbnail_name: "",
  thumbnail_title: "",
  thumbnail_alt: "",
  title: "",
  keyword: "",
  description: "",
  topic: "",
  slug: "",
  redirect: "",
  priority: 1,
  status_display: false,
  pin: false,
  // is_maincontent: false,
  language: "",
  category: "",
};

const editDataValidDefault = {
  category: false,
  formValid: false,
  thumbnail_title: false,
  thumbnail_alt: false,
  title: false,
  keyword: false,
  description: false,
  slug: false,
  redirect: false,
  isMainContent: false,
  thumbnail_name: false,
};

const thumbnailDefault = {
  thumbnail: true,
  src: "",
  file: null,
  name: null,
  remove: false,
};
const url = window.location.origin + "/";

const ModalEditPost = (props) => {
  const { t } = useTranslation("post-page");
  const { isEdit, isOpen, menuList, category, items, dataRoom } = props;
  const isSuperAdmin = useSelector(
    (state) => state.auth.userPermission.superAdmin
  );
  // console.log(items.id);
  const language = useSelector((state) => state.app.language);
  const uploadPath = useSelector((state) => state.app.uploadPath);
  const [editData, setEditData] = useState(editDataDefault);
  const [editDataValid, setEditDataValid] = useState(editDataValidDefault);
  const [previews, setPreviews] = useState(thumbnailDefault);
  const [moreImage, setMoreImage] = useState([]);
  const [moreImageRemove, setMoreImageRemove] = useState([]);
  const [checkboxList, setCheckBoxList] = useState();
  const [ckValue, setCkValue] = useState(null);
  const [displayDate, setDisplayDate] = useState(null);
  const [hiddenDate, setHiddenDate] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [curImg, setCurImg] = useState("");
  const [checkedRooms, setCheckedRooms] = useState([]);
  const [openModal, setOpenModal] = useState(false); // state สำหรับเปิด/ปิด modal
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const handleOpenModal = (index) => {
    setCurrentSchedule(index);  // เก็บ index ของ schedule ที่คลิก
    setOpenModal(true);         // เปิด Modal
  };
  const handleCloseModal = () => setOpenModal(false);

  
  const convertTimeStringToDate = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0);
    return date;
  };
  const [scheduleList, setScheduleList] = useState([
    { 
      time_start: "", 
      time_end: "", 
      description: "" 
    },
  ]);
  // console.log(items.tags)

  useEffect(() => {
    svGetTimeSchedule('post', items.id).then((res) => {
      if(res.data && res.data.length > 0) {
        setScheduleList(res.data)
      }
    })
  }, [])

  useEffect(() => {
    const tagsArray = JSON.parse(items.tags);
      setCheckedRooms(tagsArray);
  }, [items.tags]); 

  useEffect(() => {
    if (items !== null) {
      let newData = {};
      for (let key in items) {
        if (key === "status_display" || key === "pin") {
          //|| key === "is_maincontent"
          newData[`${key}`] = items[key] === 1 ? true : false;
        } else {
          newData[`${key}`] = items[key] !== null ? items[key] : "";
        }
      }
      /* Set More Images */
      if (newData.imgId) {
        let imgId = newData.imgId.split(",");
        let imgAlt = newData.imgAlt.split(",");
        let imgLanguage = newData.imgLanguage.split(",");
        let imgLink = newData.imgLink.split(",");
        let imgTitle = newData.imgTitle.split(",");
        const imageArr = [];
        for (let i = 0; i < imgId.length; i++) {
          let srcImage = uploadPath + imgLink[i];
          if (imgLanguage[i] === language || !isEdit) {
            imageArr.push({
              index: i + 1,
              id: imgId[i],
              src: srcImage,
              srcDefault: srcImage,
              language: imgLanguage[i],
              title: imgTitle[i],
              alt: imgAlt[i],
              file: null,
              name: null,
              remove: true,
            });
          }
        }
        setMoreImage(imageArr);
      } else {
        setMoreImage([]);
      }

      /* Set thumbnail */
      let thumbnail = uploadPath + newData.thumbnail_link;
      setPreviews({
        file: null,
        src: thumbnail,
        remove: true,
        srcDefault: thumbnail,
      });

      /* Set Category */
      const cateList = category.map((c) => ({
        ...c,
        checked:
          newData.category.match(new RegExp(`,${c.id},`, "g")) !== null
            ? true
            : false,
      }));
      props.setCategory(cateList);

      /* Set CkValue */
      setCkValue(newData.content);

      /* Set Data */
      setEditData(newData);

      /* Set Date display - Hidden */
      setDisplayDate(
        newData.date_begin_display !== "" &&
          newData.date_begin_display !== "0000-00-00 00:00:00"
          ? newData.date_begin_display
          : null
      );
      setHiddenDate(
        newData.date_end_display !== "" &&
          newData.date_end_display !== "0000-00-00 00:00:00"
          ? newData.date_end_display
          : null
      );
    }
    const filePath = items.thumbnail_link?.split("/");

    if (filePath) {
      setCurImg(filePath[filePath.length - 1]);
    } else {
      setCurImg("");
    }
  }, [items]);

  useEffect(() => {
    setCheckBoxList(category);
  }, [category]);

  const setPreviewHandler = (data) => {
    if (data.file) {
      setEditData({ ...editData, imageName: data.file.name });
    }

    if (data.src === undefined) {
      setPreviews(thumbnailDefault);
    } else {
      setPreviews(data);
    }
  };

  const handleAddSchedule = () => {
    setScheduleList([
      ...scheduleList,
      { time_start: null, time_end: null, description: "" },
    ]);
  };

  const handleChangeSchedule = (index, field, value) => {
    const newList = [...scheduleList];
    newList[index][field] = value;
    setScheduleList(newList);
  };
  const handleRemoveSecondRow = () => {
    // if (scheduleList.length > 1) {
      const newList = scheduleList.filter((_, i) => i !== 1);
      setScheduleList(newList);
    // }
  };
  const addMoreImage = (data) => {
    setMoreImage([
      ...moreImage,
      {
        src: data.src,
        file: data.file,
        name: data.file.name,
        index: data.index,
        default: null,
        remove: true,
        title: "",
        alt: "",
      },
    ]);
  };

  const setMoreImagePreviewHandler = (data) => {
    if (data.file === undefined) {
      const result = moreImage.filter((m, index) => index !== data.index);
      setMoreImage(result);
    } else {
      const result = moreImage.map((m, index) => {
        if (index === data.index) {
          m.src = data.src;
          m.file = data.file;
          m.name = data.file ? data.file.name : "";
        }
        return m;
      });
      setMoreImage(result);
    }

    if (data.removeId !== null) {
      setMoreImageRemove((prev) => [...prev, data.removeId]);
    }
  };

  const displayHandleChange = (newValue) => {
    setDisplayDate(newValue);
  };

  const hiddenHandleChange = (newValue) => {
    setHiddenDate(newValue);
  };

  const changeMoreImageData = (i, obj) => {
    const result = moreImage.map((m, index) => {
      return index === i ? obj : m;
    });
    setMoreImage(result);
  };

  const handleCheckboxChange = (roomId) => {
    setCheckedRooms((prevCheckedRooms) => {
      if (!Array.isArray(prevCheckedRooms)) {
        prevCheckedRooms = [];
      }
      if (prevCheckedRooms.includes(roomId)) {
        return prevCheckedRooms.filter((id) => id !== roomId);
      } else {
        return [...prevCheckedRooms, roomId];
      }
    });
  };

  const handleCKEditorChange = (index, value) => {
    handleChangeSchedule(index, "description", value); // อัปเดตค่า description ของ schedule ใน scheduleList
  };

  const saveModalHandler = (e) => {
    const cateListId = checkboxList
      .filter((f) => f.checked)
      .reduce((o, n) => {
        return o + n.id + ",";
      }, ",");

    setEditDataValid({
      ...editDataValid,
      title: editData.title === "",
      // keyword: (editData.keyword === ""),
      description: editData.description === "",
      // slug: (editData.slug === ""),
      category: cateListId === ",",
    });
    if (
      editData.title === "" ||
      // (editData.keyword === "") ||
      editData.description === "" ||
      // (editData.slug === "") ||
      cateListId === "," ||
      isFetching
    ) {
      return false;
    }
    
    setIsFetching(true);
    // console.log(scheduleList);
    // return false;
    const formData = new FormData();
    if (previews.file) {
      formData.append("Thumbnail", previews.file);
      formData.append("ThumbnailName", editData.imageName);
      formData.append("ThumbnailLink", editData.thumbnail_link);
      formData.append("ThumbnailTitle", editData.thumbnail_title);
      formData.append("ThumbnailAlt", editData.thumbnail_alt);
      formData.append("moreImageRemove", moreImageRemove);
    } else {
      formData.append("ThumbnailName", curImg);
      formData.append("ThumbnailLink", editData.thumbnail_link);
      formData.append("ThumbnailTitle", editData.thumbnail_title);
      formData.append("ThumbnailAlt", editData.thumbnail_alt);
      formData.append("moreImageRemove", moreImageRemove);
    }

    let moreImageLength = moreImage.length;
    if (moreImageLength > 0) {
      for (let i = 0; i < moreImageLength; i++) {
        if (moreImage[i].file) {
          formData.append(`Images[]`, moreImage[i].file);
          formData.append("ImagesName[]", moreImage[i].name);
          formData.append("ImagesTitle[]", moreImage[i].title);
          formData.append("ImagesAlt[]", moreImage[i].alt);
          formData.append("ImagesPosition[]", i);
        } else {
          let linkName = moreImage[i].srcDefault.split(uploadPath);
          formData.append(`EditImageTitle[]`, moreImage[i].title);
          formData.append(`EditImageAlt[]`, moreImage[i].alt);
          formData.append(`EditImageLink[]`, linkName[1] ? linkName[1] : "");
        }
      }
    }

    formData.append("id", editData.id);
    formData.append("category", cateListId);
    formData.append("title", editData.title);
    formData.append("keyword", editData.keyword);
    formData.append(
      "description",
      editData.description ? editData.description : ""
    );
    formData.append("slug", editData.slug);
    formData.append("topic", editData.topic);
    formData.append("content", ckValue ? ckValue : "");
    formData.append("redirect", editData.redirect);
    formData.append(
      "display_date",
      displayDate ? moment(displayDate).format() : null
    );
    formData.append(
      "hidden_date",
      hiddenDate ? moment(hiddenDate).format() : null
    );
    formData.append("status_display", editData.status_display ? 1 : 0);
    formData.append("pin", editData.pin ? 1 : 0);
    formData.append("is_maincontent", editData.is_maincontent ? 1 : 0);
    formData.append("priority", editData.priority);
    formData.append("old_priority", items.priority);
    formData.append("language", language);
    formData.append('schedulelist', JSON.stringify(scheduleList))
    formData.append('open_room', JSON.stringify(checkedRooms))

    svUpdateSchedule(editData.id, formData).then((res) => {
      setIsFetching(false);
      if (res.status) {
        props.setClose({
          isEdit: false,
          isOpen: false,
        });
        props.setRefreshData((prev) => prev + 1);
      }
      SwalUI({ status: res.status, description: res.description });
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Modal
        disableEnforceFocus
        open={isOpen}
        onClose={() =>
          props.setClose({
            isEdit: false,
            isOpen: false,
          })
        }
        className={"modal-edit-post"}
        aria-labelledby="modal-edit-post"
        aria-describedby="modal-edit-post"
      >
        <Box className="modal-custom">
          <div className="modal-header">
            <h2>
              <FontAwesomeIcon icon={faEdit} />
              <span>{t("แก้ไขโพส")}</span>
            </h2>
            <IconButton
              className="param-generator"
              color="error"
              sx={{ p: "10px" }}
              onClick={() =>
                props.setClose({
                  isEdit: false,
                  isOpen: false,
                })
              }
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </div>
          <div className="modal-body overflow-scroll-custom">
            <fieldset className="modal-fieldset">
              <legend className="modal-legend">
                {t("ModalEditPostTitle")}
              </legend>
              {/* <CheckBoxUI 
                className="cate-menu-list" 
                 error={editDataValid.category}
                 menuList={menuList}
                 data={checkboxList}
                 setData={setCheckBoxList} 
                 t={t} /> */}

              <div className="form-details" style={{ width: "100%" }}>
                <FieldsetUI className="image-setting" label={t("ข้อมูลรูปภาพ")}>
                  <PreviewImageUI
                    setCurImg={setCurImg}
                    className="edit-image"
                    previews={previews}
                    setPreviews={setPreviewHandler}
                  />

                  <div className="image-detail">
                    {/* {previews.file && (
                      <TextField
                        onChange={(e) => setEditData(prev => ({...prev, thumbnail_name: e.target.value}) )}
                        value={editData.thumbnail_name}
                        className="text-field-custom"
                        fullWidth={true}
                        error={editDataValid.thumbnail_name}
                        id="image-name"
                        label="Image name"
                        size="small"
                      />
                    )} */}

                    <TextField
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          thumbnail_title: e.target.value,
                        }))
                      }
                      value={editData.thumbnail_title}
                      className="text-field-custom"
                      fullWidth={true}
                      error={editDataValid.thumbnail_title}
                      id="image-title"
                      label="Image title"
                      size="small"
                    />
                    <TextField
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          thumbnail_alt: e.target.value,
                        }))
                      }
                      value={editData.thumbnail_alt}
                      className="text-field-custom"
                      fullWidth={true}
                      error={editDataValid.thumbnail_alt}
                      id="image-tag"
                      label="Alt description"
                      size="small"
                    />
                  </div>
                </FieldsetUI>
                {/* <FieldsetUI className="more-image-setting" label={t("รูปภาพเพิ่มเติม")}>
             
                  {moreImage.map((m, index ) =>  (
                    <div className="image-control" key={index}>
                      <PreviewImageUI
                        className="edit-more-image" 
                        previews={{
                          src: m.src, 
                          file: m.file, 
                          index, 
                          removeId: m.id,
                          remove: true 
                        }}
                        setPreviews={setMoreImagePreviewHandler} 
                      />
                      <div className="image-detail">
                          {m.file && (
                            <TextField
                              onChange={(e) => changeMoreImageData(index, {...m, name: e.target.value})}
                              value={m.name}
                              className="text-field-custom"
                              fullWidth={true}
                              id={`image-name-${index}`}
                              label={`Image Name ${index + 1}`}
                              size="small"
                              multiline
                            />
                          )}
                          <TextField
                              onChange={(e) => changeMoreImageData(index, {...m, title: e.target.value})}
                              value={m.title}
                              className="text-field-custom"
                              fullWidth={true}
                              error={editDataValid.thumbnail_title} 
                              id="image-title"
                              label="Image title"
                              size="small"
                              multiline
                          />
                          <TextField
                              onChange={(e) => changeMoreImageData(index, {...m, alt: e.target.value})}
                              value={m.alt}
                              className="text-field-custom"
                              fullWidth={true}
                              error={editDataValid.thumbnail_alt}
                              id="image-tag"
                              label="Alt description"
                              size="small"
                              multiline
                          />
                      </div>
                    </div>
                  ))}

                  <div className="image-control" >
                    <PreviewImageUI
                      srcError={"/images/add-image.jpg"}
                      className="edit-image" 
                      previews={{src: "", file: "", remove: false}}
                      setPreviews={addMoreImage} 
                    />
                  </div>
                </FieldsetUI> */}

                <h3 className="post-detail-title">{t("รายละเอียด")}</h3>
                <TextField
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                  value={editData.title}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.title}
                  id="cate-title"
                  label="Title"
                  size="small"
                />
                {/* <TextField
                  onChange={(e) => setEditData({...editData, keyword: e.target.value})}
                  value={editData.keyword}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.keyword}
                  id="cate-keyword"
                  label="Keyword"
                  size="small"
                /> */}
                <TextField
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  value={editData.description}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.description}
                  id="cate-description"
                  label="Description"
                  size="small"
                  multiline
                  minRows={2}
                />
                {/* <TextField
                  onChange={(e) => setEditData({...editData, slug: e.target.value})}
                  placeholder="slug/example"
                  value={editData.slug}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.slug}
                  id="cate-url"
                  label={url}
                  size="small"
                />
                <TextField
                  onChange={(e) => setEditData({...editData, topic: e.target.value})}
                  placeholder="Topic Name"
                  value={editData.topic}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.topic}
                  id="inp-topic"
                  label="Topic"
                  size="small"
                /> */}
                {/* <div style={{marginTop: "1rem"}} className="ck-content">
                  <label className="ck-edit-post">Content</label>
                  {ckValue !== null && (
                    <CKeditorComponent
                      ckNameId="ck-edit-post"
                      value={ckValue} 
                      onUpdate={setCkValue} 
                    />
                  )}
              
                </div> */}
                {/* <TextField
                  onChange={(e) => setEditData({...editData, redirect: e.target.value})}
                  placeholder="Link Url"
                  value={editData.redirect}
                  className="text-field-custom"
                  fullWidth={true}
                  error={editDataValid.redirect}
                  id="cate-redirect"
                  label="Redirect"
                  size="small"
                /> */}

                <div className="input-date">
                  <div className="input-half pr">
                    <DateTimePicker
                      className="date-input"
                      size="small"
                      label={t("Date Display")}
                      value={displayDate}
                      onChange={displayHandleChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                  <div className="input-half pl">
                    <DateTimePicker
                      className="date-input"
                      sx={{ width: 250 }}
                      label={t("Date Hidden")}
                      value={hiddenDate}
                      onChange={hiddenHandleChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                </div>

                <div className="seminar-schedule">
                  <h3 className="post-title">{t("ตารางสัมมนา")}</h3>
                  <div className="add-seminar" onClick={handleAddSchedule}>
                    <FontAwesomeIcon icon={faAdd} />
                    <p>เพิ่มตาราง</p>
                  </div>{" "}
                </div>

                {scheduleList.map((schedule, index) => (
                  <div className="input-time" key={index}>
                    <div className="input-half pr">
                      <MobileTimePicker
                        className="date-input"
                        size="small"
                        label={t("Start Time")}
                        value={schedule.time_start ? new Date(`1970-01-01T${schedule.time_start}`) : null}
                        onChange={(newValue) => {
                          const dateValue = newValue instanceof Date ? newValue : new Date(newValue);
                          handleChangeSchedule(index, "time_start", dateValue.toLocaleTimeString('en-GB', { hour12: false })) // แปลงเป็น HH:mm:ss
                        }}              
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </div>
                    <div className="input-half pl">
                      <MobileTimePicker
                        className="date-input"
                        sx={{ width: 250 }}
                        label={t("End Time")}
                        value={schedule.time_end ? new Date(`1970-01-01T${schedule.time_end}`) : null}
                        onChange={(newValue) => {
                          const dateValue = newValue instanceof Date ? newValue : new Date(newValue);
                          handleChangeSchedule(index, "time_end", dateValue.toLocaleTimeString('en-GB', { hour12: false })) // แปลงเป็น HH:mm:ss
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </div>
                    <div className="input-half pll">
                      <TextField
                        className="date-input"
                        label={t("รายระเอียด")}
                        placeholder={t("Enter details")}
                        multiline
                        rows={2}
                        maxRows={2}
                        value={schedule.description}
                        // onChange={(e) =>
                        //   handleChangeSchedule(index, "description", e.target.value)
                        // }
                        variant="outlined"
                        fullWidth
                        style={{ width: "100%" }}
                        onClick={() => handleOpenModal(index)}
                        InputProps={{
                          readOnly: true, // กำหนดให้ TextField เป็นแบบอ่านอย่างเดียว
                        }}                      
                        />
  
                        <Modal
                          open={openModal} // เปิด Modal เมื่อ openModal เป็น true
                          onClose={handleCloseModal} // ปิด Modal เมื่อคลิกข้างนอก
                        >
                          <div className="modal-container">
                            {" "}
                            <div className="ck-input">
                              <div className="modal-header">
                                <h2 className="flex items-center">
                                  {" "}
                                  <FontAwesomeIcon
                                    icon={faAdd}
                                    className="mr-2"
                                  />{" "}
                                  <span>{t("แก้ไขรายละเอียด")}</span>
                                </h2>
                                <IconButton
                                  className="param-generator"
                                  color="error"
                                  sx={{ p: "10px" }}
                                  onClick={handleCloseModal}
                                >
                                  <FontAwesomeIcon icon={faXmark} />
                                </IconButton>
                              </div>
  
                              <div className="ck-content" style={{ marginTop: "1rem" }}>
                                {currentSchedule !== null && scheduleList[currentSchedule] && (
                                  <CKeditorComponent
                                    ckNameId="ck-add-post"
                                    value={scheduleList[currentSchedule].description}  // แสดง description ตาม schedule ที่คลิก
                                    onUpdate={(value) => handleCKEditorChange(currentSchedule, value)}  // เรียกฟังก์ชัน handleCKEditorChange เมื่อ CKEditor เปลี่ยนค่า
                                  />
                                )}
                              </div>
  
                              <div className="modal-footer">
                                <ButtonUI
                                  // loader={true}
                                  // isLoading={isFetching}
                                  onClick={handleCloseModal}
                                  className="btn-save"
                                  on="save"
                                  width="md"
                                >
                                  {t("ยืนยัน")}
                                </ButtonUI>
                                {/* <ButtonUI
                                  className="btn-cancel"
                                  on="cancel"
                                  width="md"
                                  onClick={handleCloseModal}
                                >
                                  {t("ยกเลิก")}
                                </ButtonUI> */}
                              </div>
                            </div>
                          </div>
                        </Modal>

                      {/* {index !== 0 && ( */}
                      <IconButton
                        className="param-generator"
                        color="error"
                        sx={{ p: "10px" }}
                        onClick={handleRemoveSecondRow}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </IconButton>
                       {/* )} */}
                    </div>
                  </div>
                ))}

                <h3 className="post-detail-title">{t("ห้องสัมมนา")}</h3>
                <div className="setting-controls" style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '0 0.5rem' }}>
                  {dataRoom.map((room) => (
                    <div key={room.id} style={{ padding: '0 1rem'}}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Array.isArray(checkedRooms) && checkedRooms.includes(room.id)} // ตรวจสอบว่า roomId อยู่ใน array checkedRooms หรือไม่
                            onChange={() => handleCheckboxChange(room.id)} // เรียกฟังก์ชันเมื่อมีการเปลี่ยนแปลง
                            color="primary"
                          />
                        }
                        label={room.title}
                      />
                    </div>
                  ))}
                </div>

                <h3 className="post-detail-title">{t("การแสดงผล")}</h3>
                <div className="setting-controls">
                  <div className="switch-form">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                status_display: e.target.checked,
                              })
                            }
                            checked={editData.status_display}
                          />
                        }
                        label={t("แสดงบนเว็บไซต์")}
                        labelPlacement="start"
                      />
                    </FormGroup>
                  </div>
                  {/* <div className="switch-form">
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                pin: e.target.checked,
                              })
                            }
                          />
                        }
                        checked={editData.pin}
                        label={t("ปักหมุด")}
                        labelPlacement="start"
                      />
                    </FormGroup>
                  </div> */}
                  {/* {isSuperAdmin && (
                    <div className="switch-form">
                      <FormGroup>
                        <FormControlLabel  control={<Switch onChange={(e) => setEditData({...editData, is_maincontent: e.target.checked})} checked={editData.is_maincontent} /> }   label="หัวข้อหลัก" labelPlacement="start" />
                      </FormGroup>
                    </div>
                  )} */}

                  {/* <div className="input-group">
                    <div className="inp"> 
                      <ButtonUI
                        color="error"
                        onClick={(e) => (editData.priority > 1)?setEditData({...editData, priority: editData.priority - 1}):""} >
                        <FontAwesomeIcon icon={faMinus} />
                      </ButtonUI>
                      <span className="title">
                        {t("ModalPriority")} {editData.priority}
                      </span>
                      <ButtonUI onClick={(e) => setEditData({...editData, priority: editData.priority + 1}) }>
                        <FontAwesomeIcon icon={faAdd} />
                      </ButtonUI>
                    </div>
                  </div> */}
                </div>
              </div>
            </fieldset>
          </div>
          <div className="modal-footer">
            <ButtonUI
              loader={true}
              isLoading={isFetching}
              className="btn-save"
              on="save"
              width="md"
              onClick={saveModalHandler}
            >
              {t("Save")}
            </ButtonUI>
            <ButtonUI
              className="btn-cancel"
              on="cancel"
              width="md"
              onClick={() =>
                props.setClose({
                  isEdit: false,
                  isOpen: false,
                })
              }
            >
              {t("Cancel")}
            </ButtonUI>
          </div>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default ModalEditPost;
