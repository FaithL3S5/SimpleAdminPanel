import React, {useState} from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CDataTable,
  CFormGroup,
  CInput,
  CRow,
  CSelect,
  CForm
} from '@coreui/react'
import defaultUsersData from './defaultUsersData'

const Tables = () => {

  let usersDataTemp = defaultUsersData.sort((a, b) => {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
  
    // names must be equal
    return 0;
  })

  const [details, setDetails] = useState([])
  const [usersData, setUsersData] = useState(usersDataTemp)
  const [hidden, setHidden] = useState(true)
  const [hiddenEdit, setHiddenEdit] = useState(true)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [nameEdit, setNameEdit] = useState('')
  const [roleEdit, setRoleEdit] = useState('')
  const [statusEdit, setStatusEdit] = useState('')
  // const [items, setItems] = useState(usersData)

  const toggleDetails = (index) => {
    const position = details.indexOf(index)
    let newDetails = details.slice()
    if (position !== -1) {
      newDetails.splice(position, 1)
    } else {
      newDetails = [...details, index]
    }
    setDetails(newDetails)
  }


  const fields = [
    { key: 'name', _style: { width: '40%'} },
    'registered',
    { key: 'role', _style: { width: '20%'} },
    { key: 'status', _style: { width: '20%'} },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ]

  const getBadge = (status)=>{
    switch (status) {
      case 'Active': return 'success'
      case 'Inactive': return 'secondary'
      case 'Pending': return 'warning'
      case 'Banned': return 'danger'
      default: return 'primary'
    }
  }

  const deleteUser = (item) => {
    let my = usersData.filter(function( obj ) {
      return obj.id !== item.id;
    });
    setUsersData(my);
    toggleDetails(0);
  }

  const resetUser = () => {
    window.location.reload();
  }

  const addHandler = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    if(name===''||role===''||status===''){
      alert('Please fill and select all fields before submitting')
    }else{
      let pushedObject = {
        id: usersData.length+1,
        name: name,
        registered: today,
        role: role,
        status: status
      }
      usersData.push(pushedObject);
      setName('');
      setRole('');
      setStatus('');
      setHidden(true);
      alert('Data successfully submitted')
    }
  }

  const editHandler = (item) => {
    let editedName = item.name;
    let editedRole = item.role;
    let editedStatus = item.status;

    if(nameEdit !== ""){
      editedName = nameEdit
    }
    if(roleEdit !== ""){
      editedRole = roleEdit
    }
    if(statusEdit !== ""){
      editedStatus = statusEdit
    }

    let pushedObjectEdit = [{
      id: item.id,
      name: editedName,
      registered: item.registered,
      role: editedRole,
      status: editedStatus
    }]

    setUsersData(usersData.map(obj => pushedObjectEdit.find(o => o.id === obj.id) || obj));

    setNameEdit('');
    setRoleEdit('');
    setStatusEdit('');
    setHiddenEdit(true);
    toggleDetails(0);
    alert('Data successfully submitted');
    console.log(usersData);
  }

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              Available Users List
              <CButton size="sm" color={hidden ? 'success' : 'secondary'} className="ml-1 float-right" onClick={() => {setHidden(!hidden)}}>
                {
                  hidden ? 'Add Data' : 'Cancel'
                }
              </CButton>
              <CButton size="sm" color="warning" className="ml-1 float-right" onClick={() => resetUser()}>
                Reset Data
              </CButton>
            </CCardHeader>
            <CCollapse show={!hidden}>
              <CCardBody>
                <CForm>
                  <CFormGroup className="p-2 mb-0">
                    <CInput id="name" placeholder="Enter user's name" required onChange = {(e) => setName(e.target.value)} />
                    <CSelect
                    id="role"
                    className="mt-2"
                    onChange = {(e) => setRole(e.target.value)}
                    required
                    >
                      <option defaultValue>Select user's role</option>
                      <option value="Guest">Guest</option>
                      <option value="Member">Member</option>
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                      <option value="Alien">Alien</option>
                    </CSelect>
                    <CSelect
                    id="status"
                    className="mt-2"
                    onChange = {(e) => setStatus(e.target.value)}
                    required
                    >
                      <option defaultValue>Select user's status</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Banned">Banned</option>
                      <option value="Dont Panic!">Dont Panic!</option>
                    </CSelect>
                    <CButton size="sm" color="success" className="mt-3 float-right" onClick={() => addHandler()}>
                      Submit Data
                    </CButton>
                  </CFormGroup>
                </CForm>
              </CCardBody>
            </CCollapse>
            <CCardBody>
              <CDataTable
                items={usersData}
                fields={fields}
                tableFilter
                footer
                itemsPerPageSelect
                itemsPerPage={5}
                hover
                pagination
                sortable
                scopedSlots = {{
                  'status':
                    (item)=>(
                      <td>
                        <CBadge color={getBadge(item.status)}>
                          {item.status}
                        </CBadge>
                      </td>
                    ),
                  'show_details':
                    (item, index)=>{
                      return (
                        <td className="py-2">
                          <CButton
                            color="primary"
                            variant="outline"
                            shape="square"
                            size="sm"
                            onClick={()=>{toggleDetails(index)}}
                          >
                            {details.includes(index) ? 'Cancel' : 'Options'}
                          </CButton>
                        </td>
                        )
                    },
                  'details':
                      (item, index)=>{
                        return (
                        <CCollapse show={details.includes(index)}>
                          <CCardBody>
                            <h4>
                              {item.username}
                            </h4>
                            <p className="text-muted">User since: {item.registered}</p>
                            <CButton size="sm" color="info" onClick={() => setHiddenEdit(!hiddenEdit)}>
                            {
                              hiddenEdit ? 'Edit' : 'Cancel'
                            }
                            </CButton>
                            <CButton size="sm" color="danger" className="ml-1" onClick={()=>deleteUser(item)}>
                              Delete
                            </CButton>
                            <CCollapse show={!hiddenEdit}>
                              <CCardBody>
                                <CForm>
                                  <CFormGroup className="mb-4">
                                    <CInput id="name" placeholder={item.name} required onChange = {(e) => setNameEdit(e.target.value)} />
                                    <CSelect
                                    id="role"
                                    className="mt-2"
                                    onChange = {(e) => setRoleEdit(e.target.value)}
                                    required
                                    >
                                      <option defaultValue>Current role is {item.role}</option>
                                      <option value="Guest">Guest</option>
                                      <option value="Member">Member</option>
                                      <option value="Staff">Staff</option>
                                      <option value="Admin">Admin</option>
                                      <option value="Alien">Alien</option>
                                    </CSelect>
                                    <CSelect
                                    id="status"
                                    className="mt-2"
                                    onChange = {(e) => setStatusEdit(e.target.value)}
                                    required
                                    >
                                      <option defaultValue>Current status is {item.status}</option>
                                      <option value="Active">Active</option>
                                      <option value="Pending">Pending</option>
                                      <option value="Inactive">Inactive</option>
                                      <option value="Banned">Banned</option>
                                      <option value="Dont Panic!">Dont Panic!</option>
                                    </CSelect>
                                    <CButton size="sm" color="success" className="mt-3 float-right" onClick={() => editHandler(item)}>
                                      Submit Data
                                    </CButton>
                                  </CFormGroup>
                                </CForm>
                              </CCardBody>
                            </CCollapse>
                          </CCardBody>
                        </CCollapse>
                      )
                    }
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Tables
