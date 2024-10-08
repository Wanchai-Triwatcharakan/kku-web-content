import React, {  Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DateMoment from "../../../components/ui/date-moment/date-moment";
import ModalAddService from "../service-modal/service-add-modal";
import ModalEditService from "../service-modal/service-edit-modal";
import ContentCardUI from "../../../components/ui/content-card/content-card";
 
import { faEyeSlash, faFolderOpen,  faMapPin, faLanguage, faLink, faPenNib, faStopwatch, faWindowRestore } from "@fortawesome/free-solid-svg-icons";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faNewspaper }  from "@fortawesome/free-regular-svg-icons"; 
import { TablePagination } from "@mui/material";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import SwalUI from "../../../components/ui/swal-ui/swal-ui";
import { svDeleteServiceByToken } from "../../../services/service.service";
import { appActions } from "../../../store/app-slice";
import { useTranslation } from "react-i18next";
const modalSwal = withReactContent(Swal);

const tabLists = [
    { value: "0", title: "ทั้งหมด", icon: <FontAwesomeIcon icon={faFolderOpen} /> },
    { value: "1", title: "แสดงบนเว็บไซต์", icon: <FontAwesomeIcon icon={faWindowRestore} /> },
    { value: "2", title: "ปักหมุด", icon: <FontAwesomeIcon icon={faMapPin} /> },
    { value: "3", title: "ซ่อนบนเว็บไซต์", icon: <FontAwesomeIcon icon={faEyeSlash} /> },
] 


const ServiceTab = (props) => {
  const { serviceModalAdd,setServiceModalAdd,menuList, serviceTab, serviceData, isRowDisplay, pageControl, category, servicesList } = props;
  const { t } = useTranslation('service-page')
 
  const isSuerperAdmin = useSelector(state => state.auth.userPermission.superAdmin)
  const [totalData, setTotalData] = useState(-1)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [limited, setLimited] = useState({begin: 0, end: rowsPerPage})
  const [filteredData, setFilteredData] = useState([]) 
  const [ items , setItems ] = useState(null) 
  const [serviceModalEdit, setServiceModalEdit] = useState({
    isEdit: false,
    isOpen: false
  })  

  useEffect(() => { 
    if(category.length > 0) {
      setServiceFilterData().then(res => {
        setTotalData(res.length)
        setFilteredData(res.slice(limited.begin, limited.end))
      })
    }
  }, [serviceTab, serviceData, page, rowsPerPage, pageControl, category]);

  const setServiceFilterData = async () => {
    const filtered = await serviceData.filter((f) => { 
      /* กรอง Tab */
      if(serviceTab === "1" && f.status_display === 0){
        return false;
      } else if(serviceTab === "2" && f.pin === 0){
        return false;
      } else if(serviceTab === "3" && f.status_display === 1){
        return false
      }
      /* กรอง Page */
      if(pageControl !== "") {
        let category = f.category.slice(1,-1).split(',')
        if(!category.includes(`${pageControl}`)){
          return false
        } 
      }
      return f
    })
    const maped = await filtered.map((d) => {
      let exp = d.category.slice(1,-1).split(',')
      const cateLists = exp.map(cid => category[parseInt(cid)])
      return {...d, cateLists}
    }) 
    return maped;
  }

  const handleTabChange = (event, newValue) => {
    props.setServiceTab(newValue);
  }

  /* Pagination */
  const handleChangePage = (event, newPage) => { 
    setLimited({begin: newPage * rowsPerPage, end: (((newPage+1) * rowsPerPage) )})
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    let rowPage = parseInt(event.target.value, 10)
    setRowsPerPage(rowPage);
    setLimited({begin: 0, end: rowPage  })
    setPage(0);
  }

  const addHandler = (item) => {
    setItems(item)
    setServiceModalEdit({
      isEdit: false,
      isOpen: true
    }) 
  }
  
  const editHandler = (item) => {
    setItems(item)
    setServiceModalEdit({
      isEdit: true,
      isOpen: true
    }) 

  } 
  const deleteHandler = (item) => {
    let buttonIcon = (item.is_maincontent === 1)?"question":"warning";
    let text = (item.is_maincontent === 1)?" ( Main Content )":" Content";
 
    modalSwal.fire({
      icon: buttonIcon,
      title: "Delete" + text,
      text: `Do you want to delete "${item.title}" ?`  ,
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "#e11d48",
      showCancelButton: true,
      cancelButtonText: "Cancel"
    }).then(result => {
      if(result.isConfirmed){
        svDeleteServiceByToken(item.id,item.language).then(res => {
          SwalUI({status: res.status, description: res.description})
          if(res.status) {
            props.setRefreshData(prev => prev + 1)
          }
        })
      }
    
    })

  }

  return (
    <Fragment>

    <Box className="service-tab-section" sx={{ width: '100%' }}>
      <TabContext value={serviceTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
              {tabLists.map((tab) => (
                <Tab className="service-tab-header" 
                  value={tab.value} 
                  key={tab.value} 
                  icon={tab.icon} 
                  label={t(tab.title)} />
              ))}
          </TabList>
          </Box>
          {tabLists.map((tab) =>  (
          
            <TabPanel className={`service-tab-body ${(isRowDisplay)?"asRow":"asColumn"}`} value={tab.value} key={tab.value}>
              <div className="item-list"> 
                {filteredData.map((item,index) => (
                  <ContentCardUI 
                    key={index} 
                    onAddClick={() => addHandler(item)}
                    onEditClick={() => editHandler(item)}
                    onDeleteClick={() => deleteHandler(item)}
                    mainContent={item.is_maincontent}
                    className="service-card-content" 
                    data={{
                      alt: item.thumbnail_alt,
                      image: item.imgLink?.split(',')[0],
                      // image: item.thumbnail_link,
                      language: item.language,
                    }} 
                    isRowDisplay={isRowDisplay}  
                  >
                    <h3 className="title">
                      {isSuerperAdmin && <span className="id" title="ref id">[ {item.id} ]</span> }
                      {item.title}
                      {item.is_maincontent ? <span className="id" title="ref id"> ( Main Content )</span> : <></>}
                    </h3> 
                    <p className="desc">{item.description}</p>   
                    <p className="cate">
                      <span className="fa-icon" title="category"> <FontAwesomeIcon icon={faLink} /></span>
                      {/* <span>{item.cateLists.map((c,index) => (index>0)?` , ${c.title}`:c.title) }</span> */}
                    </p>  
                    <p className="display">
                    { item.date_begin_display !== null && (
                      <Fragment>
                        <span className="fa-icon" title="show"><FontAwesomeIcon icon={faStopwatch} /></span>
                        <span><DateMoment format={"LLL"} date={item.date_begin_display} /></span>
                      </Fragment>
                    )}
                    { item.date_end_display !== null && (
                      <Fragment>
                        <span className="fa-icon" title="hidden"><FontAwesomeIcon icon={faClock} /></span> 
                        <span><DateMoment format={"LLL"} date={item.date_end_display} /></span>
                      </Fragment>
                    )}
                  </p> 
                    <p className="editor">
                      {item.editorName && (
                        <>
                          <span className="fa-icon" title="editor"><FontAwesomeIcon icon={faPenNib} /></span>
                          <span>{item.editorName}</span>
                        </>
                      )}
                      <span className="fa-icon" title="editor"><FontAwesomeIcon icon={faLanguage} /></span>
                      <b>{item.language.toUpperCase()}</b> 
                    </p>   
                  </ContentCardUI>
                ))}
              </div>
              <TablePagination
                component="div"
                count={totalData}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TabPanel>
          ))}
          
      </TabContext>
    </Box>

    {serviceModalAdd && 
      <ModalAddService 
        category={category}
        menuList={menuList}
        servicesList={servicesList}
        setRefreshData={props.setRefreshData} 
        totalData={totalData} 
        isOpen={serviceModalAdd} 
        setClose={setServiceModalAdd} /> } 
    {serviceModalEdit.isOpen && (
      <ModalEditService 
        items={items}
        category={category}
        menuList={menuList}
        servicesList={servicesList}
        setRefreshData={props.setRefreshData} 
        totalData={totalData} 
        setCategory={props.setCategory}
        isEdit={serviceModalEdit.isEdit} 
        isOpen={serviceModalEdit.isOpen} 
        setClose={setServiceModalEdit} 
      /> 
    )}
    
    </Fragment>
  )
}

export default ServiceTab;
