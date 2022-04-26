var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];
var personAvatar = ['avatar.png', 'beard.png', 'boy.png', 'gamer.png', 'lady.png', 'man.png', 'profile.png', 'woman.png']
var locationPic = ['city1.jpeg', 'city2.jpeg', 'city3.jpeg', 'city4.jpeg', 'city5.jpeg'];
var departmentPic = ['dep1.jpeg', 'dep2.jpeg', 'dep3.jpeg', 'dep4.jpeg'];


let locationList;
let deleteInfo;
let currentId;
let title;

let locationFilter= [];
let departmentFilter= [];
let searchTerm = 'person';
let searchVal;

$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(2000).fadeOut('slow', function() {
            $(this).remove();
        });
    }
});


$('document').ready(function() {

    ajaxCall();
    deleteCurrent();
    filterModal();
    fill();
    changeSearchTerm();
    addNew();
       
    $('#search').keyup(function(){
        searchVal = $(this).val();
        search(searchVal, searchTerm);
    });
    //add data to sql events
    $('#addNewDepBtn').click(function(){
        addNewDepartment();
    });
    $('#addNewLocBtn').click(function(){
        addNewLocation();
    })
    $('#addNewPersonBtn').click(function(){
        addNewPerson();
    })
});



//add new department
function addNewDepartment(){

    let depName = $('#newDepValue').val().trim();
    let locationid = $('#newLocSelect').val();
    let locationName = $('#newLocSelect').find('option:selected').text();


    if(depName.length > 0 && locationid != 'none'){
        $.ajax({
            url: "libs/php/addDepartment.php",
            type: 'POST',
            dataType: 'json',
            data: {
                name: depName, 
                locationID: locationid,
            },
            success: function(result) {
                    $('#addModal').modal('hide');
                    $('#respondModal').modal('show');
                if (result.status.code == 200) {
                    $('#respondAdd').html(`You have successfully added ${depName} department to ${locationName}`);
                    $('#depFilterTag').append(`<table>
                    <tr>
                        <td class="depTable"><input class="depcheckBox" type="checkbox" value="${depName}">${depName}</td>
                    </tr>
                    </table> `)
                    fill();
                    ajaxCall();
                } else if (result.status.code == 400 || result.status.code == 300) {
                    $('#respondAdd').html(`There was an error, please try again`)
                } else if(result.status.code == 202) {
                    $('#respondAdd').html(`${depName} department is already exists.`)
                }
            }
        });        
    } else {
        $('#respondModal').modal('show');
        $('#respondAdd').html('Please fill the form.') 
    }
}

//add new Location
function addNewLocation(){

    let locName = $('#newLocValue').val().trim();
    
    if(locName.length > 0){
        $.ajax({
            url: "libs/php/addLocation.php",
            type: 'POST',
            dataType: 'json',
            data: {
                name: locName
            },
            success: function(result) {
                    $('#addModal').modal('hide');
                    $('#respondModal').modal('show');
                if (result.status.code == 200) {
                    $('#respondAdd').html(`You have successfully added ${locName}`);
                    $('#locFilterTag').append(`<table>
                    <tr>
                        <td class="locTable"><input class="loccheckBox" type="checkbox" value="${locName}">${locName}</td>
                    </tr>
                    </table> `)
                    fill();
                    ajaxCall();
                } else if(result.status.code == 202) {
                    $('#respondAdd').html(`${locName} is already exists.`)
                } else {
                     $('#respondAdd').html(`There was an error, please try again`);
                }
            }
        });
    } else {
        $('#respondModal').modal('show');
        $('#respondAdd').html('Please fill the form.')  
    }
}

//add New person
function addNewPerson(){

    let fName = $('#newFNameValue').val().trim();
    let lName = $('#newLNameValue').val().trim();
    let email = $('#newEmailValue').val().trim();
    let jobTitle = $('#newjobTitleValue').val().trim();
    let dep = $('#newDepSelect').val();
    let depName = $('#newDepSelect').find('option:selected').text()

    if(fName.length > 0 && lName.length > 0 && jobTitle.length > 0 && dep != 'none') {
        if(ValidateEmail(email)){
            $.ajax({
                url: "libs/php/addPerson.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    firstName: fName,
                    lastName: lName,
                    email: email,
                    jobTitle: jobTitle,
                    department: dep,
                },
                success: function(result) {
                        $('#addModal').modal('hide');
                        $('#respondModal').modal('show');
                    if (result.status.code == 200) {
                        $('#respondAdd').html(`You have successfully added ${fName} ${lName} to ${depName}`);
                        ajaxCall();
                    } else if (result.status.code == 400 || result.status.code == 300) {
                        $('#respondAdd').html(`There was an error, please try again.`)
                    } else if(result.status.code == 202) {
                        $('#respondAdd').html(`${fName} ${lName} is already exists.`)
                    }
                }
            }); 
        }else {
            $('#respondModal').modal('show');
            $('#respondAdd').html('You have entered an invalid email, please try again.')            
        }
    } else {
            $('#respondModal').modal('show');
            $('#respondAdd').html('Please fill the form.')
        
    }

}


//delete by ID events
function deleteCurrent() {
    $('#deleteYes').click(function(){
        if(deleteInfo == 'person'){
            deleteClear('./libs/php/deletePersonByID.php')
        } else if(deleteInfo == 'department'){
            deleteClear('./libs/php/deleteDepartmentByID.php');
        } else if(deleteInfo == 'location'){
            deleteClear('./libs/php/deleteLocationByID.php')
        }
    })
    $('#deleteNo').click(function(){
        $('#deleteModal').modal('hide');
    })
}

function deleteClear(url){

             $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: {
                    id: currentId 
                },
                success: function(result) {
                    if(result.status.code == 200) {
                        $('#respondModal').modal('show');
                        $('#respondAdd').html(`Delete was successfull`);
                        $('#deleteModal').modal('hide');
                        fill();
                        ajaxCall();
                    } else if(result.status.code == 202){
                        $('#respondModal').modal('show');
                        $('#respondAdd').html(result.status.description);
                        $('#deleteModal').modal('hide'); 
                    } else if (result.status.code == 400){
                        $('#respondModal').modal('show');
                        $('#respondAdd').html(`There was something wrong,please try again`);
                        $('#deleteModal').modal('hide');
                    }
                }
            })
}

//save changes to sql database
function saveChange(){
    $('.saveBtn').click(function(){

        let data = [];
        $(this).parent().siblings().children('.personEdit').children().children('input').each(function (){
            data.push($(this).val())
        });
        let deplocId = $(this).parent().siblings().children('.personEdit').children().children('select').val();
        
        if(deleteInfo == 'person'){
            if(data[0].length > 0 && data[1].length > 0 && data[0].length > 0) {
                if(ValidateEmail(data[2])) {
                $.ajax({
                    url: './libs/php/editPerson.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        firstName: data[0], 
                        lastName: data[1],
                        email: data[2],
                        jobTitle: data[3],
                        id: currentId,
                        departmentId: deplocId,
                    },
                    success: function(result) {
                        $('#respondModal').modal('show')
                        if(result.status.code == 200) {
                            $(this).addClass('hide');
                            $(this).siblings('.editBtn').removeClass('hide');
                            $(this).parent().siblings().children('.personFull').removeClass('hide');
                            $(this).parent().siblings().children('.personEdit').addClass('hide');

                            $('#respondAdd').html(`Edit was successfull`);
                            ajaxCall();
                        } else if (result.status.code == 400){
                            $('#respondAdd').html('There was something wrong, please try again');
                        }
                    }
                })                    
                } else {
                    $('#respondModal').modal('show');
                    $('#respondAdd').html('You have entered an invalid email, please try again.')
                }
            } else {
                    $('#respondModal').modal('show');
                    $('#respondAdd').html('Please fill the form.')
                
            }
        } else if(deleteInfo == 'department'){
            if(data[0].length > 0) {
            $.ajax({
                url: './libs/php/editDepartment.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    name: data[0],
                    id: currentId,
                    locationId: deplocId,
                },
                success: function(result) {
                    $('#respondModal').modal('show')
                    if(result.status.code == 200) {
                        $('#respondAdd').html(`Edit was successfull`);
                        fill();
                        ajaxCall();
                    } else if (result.status.code == 400){
                        $('#respondAdd').html('There was something wrong, please try again');
                    }
                }
            })                
            } else {
                $('#respondModal').modal('show');
                $('#respondAdd').html('Please fill the form.')
            }
        } else if(deleteInfo == 'location'){
            if(data[0].length > 0) {
            $.ajax({
                url: './libs/php/editLocation.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    name: data[0],
                    id: currentId,
                },
                success: function(result) {
                    $('#respondModal').modal('show')
                    if(result.status.code == 200) {
                        $('#respondAdd').html(`Edit was successfull`);
                        fill();
                        ajaxCall();
                    } else if (result.status.code == 400){
                        $('#respondAdd').html('There was something wrong, please try again');
                    }
                }
            })
            } else {
                $('#respondModal').modal('show');
                $('#respondAdd').html('Please fill the form.')
            }

        }

    })
}

function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.match(mailformat)) {
        return true;
    } else {
        return false;
    }
}

function cancel(){
    $('.cancel').click(function(){
        $('.saveBtn').addClass('hide');
        $('.personFull').removeClass('hide');
        $('.personEdit').addClass('hide');
        $('.editBtn').removeClass('hide'); 
    })
}


function editChange(){
    $('.editBtn').click(function(){
        $('.saveBtn').addClass('hide');
        $('.personFull').removeClass('hide');
        $('.personEdit').addClass('hide');
        $('.editBtn').removeClass('hide');
        $(this).addClass('hide');
        $(this).siblings('.saveBtn').removeClass('hide');
        $(this).parent().siblings().children('.personFull').addClass('hide');
        $(this).parent().siblings().children('.personEdit').removeClass('hide');

        
        title = $(this).parent().siblings().children('.personFull').children('h5').text();
        currentId = $(this).parent().parent().attr('id');
        if($(this).parent().parent().hasClass('personsCard')){
            deleteInfo = 'person';

            let fName = $(this).parent().siblings().children('.personEdit').children().children('.fName');
            let lName = $(this).parent().siblings().children('.personEdit').children().children('.lName');
            let email = $(this).parent().siblings().children('.personEdit').children().children('.email');
            let jobTitle = $(this).parent().siblings().children('.personEdit').children().children('.jobTitle');
            let dep = $(this).parent().siblings().children('.personEdit').children().children('.editDepSel');

            $.ajax({
                url: './libs/php/getPersonnelByID.php',
                type: 'POST',
                dataType: 'json',
                data: {id: currentId},
                success: function(result) {
                    let data = result.data['personnel'][0];
                    fName.val(data.firstName);
                    lName.val(data.lastName);
                    email.val(data.email);
                    jobTitle.val(data.jobTitle);
                    dep.val(data.departmentId);
                }
            });
        } else if ($(this).parent().parent().hasClass('depsCard')) {
            deleteInfo = 'department';
            let depName = $(this).parent().siblings().children('.personEdit').children().children('.depName');
            let loc = $(this).parent().siblings().children('.personEdit').children().children('.editLocSel'); 

            $.ajax({
                url: './libs/php/getDepartmentByID.php',
                type: 'POST',
                dataType: 'json',
                data: {id: currentId},
                success: function(result) {
                    let data = result.data[0];
                    depName.val(data.name);
                    loc.val(data.locationID);
                    
                }
            });

        } else if ($(this).parent().parent().hasClass('locsCard')) {
            deleteInfo = 'location';
            let locName =$(this).parent().siblings().children('.personEdit').children().children('.locName');
            $.ajax({
                url: './libs/php/getLocationByID.php',
                type: 'POST',
                dataType: 'json',
                data: {id: currentId},
                success: function(result) {
                    let data = result.data[0];
                    locName.val(data.name);
                }
            });
        }
    })
}

function deleteChange(){
    $('.deleteBtn').click(function(){
        $('.saveBtn').addClass('hide');
        $('.personFull').removeClass('hide');
        $('.personEdit').addClass('hide');
        $('.editBtn').removeClass('hide');
        ;
        $('#deleteYes, #deleteNo').removeClass('hide');
        
        title = $(this).parent().siblings().children('.personFull').children('h5').text();
        currentId = $(this).parent().parent().attr('id');
        if($(this).parent().parent().hasClass('personsCard')){
            deleteInfo = 'person';
            $('#deleteModal').modal('show');
            $('#deleteText').html(`Are you sure you want to delete ${title}?`);
        } else if ($(this).parent().parent().hasClass('depsCard')) {
            deleteInfo = 'department';
            $.ajax({
                url: './libs/php/assignDepartment.php',
                type: 'POST',
                dataType: 'json',
                data: {id: currentId},
                success: function(result) {
                    if(result.data[0].pc > 0) {
                        $('#respondModal').modal('show');
                        $('#respondAdd').html('Staff assigned to this department');
                    } else {
                        $('#deleteModal').modal('show'); 
                        $('#deleteText').html(`Are you sure you want to delete ${title} department?`);
                    }
                }
            });
            
        } else if ($(this).parent().parent().hasClass('locsCard')) {
            deleteInfo = 'location';
            $.ajax({
                url: './libs/php/assignLocation.php',
                type: 'POST',
                dataType: 'json',
                data: {id: currentId},
                success: function(result) {
                    if(result.data[0].pc > 0) {
                        $('#respondModal').modal('show');
                        $('#respondAdd').html('Department assigned to this location');
                    } else {
                        $('#deleteModal').modal('show'); 
                        $('#deleteText').html(`Are you sure you want to delete ${title} location?`);
                    }
                }
            });
        }
    })
}

function addNew(){
    $('#addNew').click(function(){
        if(searchTerm == 'person') {
            $('#addModal').modal('show');
            $('#addTitle').html('Add New Person');
            $('#fNameForm, #lNameForm, #emailForm, #depForm, #newDepSelect, #jobTitleForm').removeClass('hide');
            $('#addNewDepBtn, #addNewLocBtn, #newDepValue, #locForm').addClass('hide');
            $('#addNewPersonBtn').removeClass('hide'); 
        } else if(searchTerm == 'department') {
            $('#addModal').modal('show');
            $('#addTitle').html('Add New Department');
            $('#fNameForm, #lNameForm , #emailForm, #newDepSelect, #newLocValue, #jobTitleForm').addClass('hide');
            $('#depForm, #newDepValue, #newLocSelect, #locForm').removeClass('hide');
            $('#addNewPersonBtn, #addNewLocBtn').addClass('hide');
            $('#addNewDepBtn, #newDepValue').removeClass('hide');  
        }else if(searchTerm == 'location') {
            $('#addModal').modal('show');
            $('#addTitle').html('Add New Location')
            $('#fNameForm, #lNameForm ,#emailForm, #depForm, #newLocSelect, #jobTitleForm').addClass('hide');
            $('#addNewDepBtn, #addNewPersonBtn').addClass('hide');
            $('#addNewLocBtn, #newLocValue, #locForm').removeClass('hide'); 
        }
    })
};


function filterModal(){
    $('#filterBtn').click(function(){
        $('#filterModal').modal('show');
    })
}

function changeSearchTerm(){
    $('#personsTab').click(function(){
        $('#search').attr('placeholder', 'Search By Name');
        $('#search').val('');
        searchTerm = 'person';
        ajaxCall();
    })
    $('#depTab').click(function(){
        $('#search').attr('placeholder', 'Search By Department');
        $('#search').val('');
        searchTerm = 'department';
        ajaxCall();
    })
    $('#locTab').click(function(){
        $('#search').attr('placeholder', 'Search By Location');
        $('#search').val('');
        searchTerm = 'location';
        ajaxCall();
    })
};


function search(searchData, searchTermData){
        if(searchTermData == 'person') {
            $.ajax({
                url: './libs/php/searchPerson.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    search: searchData,
                },
                success: function(result) {
                        $.ajax({
                            url: './libs/php/getTotalDepartment.php',
                            type: 'POST',
                            dataType: 'json',
                            data: {},
                            success: function(result) {
                                if(result.status.code == 200) {
                                    for(var i = 0; i < result.data.length; i++) {
                                        $('.editDepSel').append(`<option value="${result.data[i].departmentID}">${result.data[i].departmentName}</option>`)
                                    }
                                    $('.editDepSel').each(function(){
                                        var id = $(this).parent().attr('id');
                                        $(this).val(id);
                                    })                                   
                                }
                            }
                        })
                    if(result.status.code == 200) {
                        $('#personsCardBox').html('');
                        $('#personNumber').html(result.data.length);
                        createPersonCard(result.data);
                        editChange();
                        saveChange();
                        deleteChange();
                        cancel();
                    } else {
                        $('#respondAdd').html('There was something wrong, please try again');
                        $('#respondModal').modal('show')
                    }
                }
            })
        } else if(searchTermData == 'department'){

            $.ajax({
                url: './libs/php/searchDepartment.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    search: searchData,
                },
                success: function(result) {
                        $.ajax({
                            url: './libs/php/getTotalLocation.php',
                            type: 'POST',
                            dataType: 'json',
                            data: {},
                            success: function(result) {
                                if(result.status.code == 200) {
                                    for(var i = 0; i < result.data.length; i++) {
                                        $('.editLocSel').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`)
                                    }
                                $('.editLocSel').each(function(){
                                    var id = $(this).parent().attr('id');
                                    $(this).val(id);
                                })                                    
                                }
                            }
                        })
                    if(result.status.code == 200) {
                        $('#depCardBox').html('');
                    $('#depNumber').html(result.data.length);
                        createDepCard(result.data);
                        editChange();
                        saveChange();
                        deleteChange();
                        cancel();
                    } else {
                        $('#respondAdd').html('There was something wrong, please try again');
                        $('#respondModal').modal('show')
                    }
                }
            })
        } else if (searchTermData == 'location'){
            $.ajax({
                url: './libs/php/searchLocation.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    search: searchData,
                },
                success: function(result) {
                    if(result.status.code == 200) {
                        $('#locCardBox').html('');
                        $('#locNumber').html(result.data.length);
                        createLocCard(result.data);
                        editChange();
                        saveChange();
                        deleteChange();
                        cancel();
                    } else {
                        $('#respondAdd').html('There was something wrong, please try again');
                        $('#respondModal').modal('show')
                    }
                }
            })
        };
}


function createPersonCard(resultArray){
for(var i =0; i<resultArray.length; i++){
   
    $('#personsCardBox').append(`<div id="${resultArray[i].id}" class="card text-white bg-dark mb-3 personsCard">
    <div class="card-header">
        <button class="btn btn-danger deleteBtn">Delete</button>
        <button class="btn btn-secondary float-right editBtn">Edit</button>
        <button class="btn btn-success float-right hide saveBtn">Save</button>
    </div>
    <div class="card-body text-center">
        <div class="personFull">
            <h5 class="card-title">${resultArray[i].name} ${resultArray[i].lastName}</h5>
            <div class="card-text text-left">
                <p>${resultArray[i].email}</p>
                <p>${resultArray[i].jobTitle}</p>
                <p>${resultArray[i].department}</p>
                <p>${resultArray[i].location}</p>
            </div>                            
        </div>
        <div class="personEdit text-left hide">
            <div class="form-group">
                <input type="text" class="form-control fName" value="" placeholder="First Name">
            </div>
            <div class="form-group">
                <input type="text" class="form-control lName" value="" placeholder="Last Name">
            </div>
            <div class="form-group">
                <input type="text" class="form-control email" value="" placeholder="Email">
            </div>
            <div class="form-group">
                <input type="text" class="form-control jobTitle" value="" placeholder="Job Title">
            </div>         
            <div class="form-group">
                <select class="browser-default custom-select editDepSel"></select>
            </div>
            <div class="w-100 text-center cancel">
                <button class="btn btn-secondary">Cancel</button>
            </div>
        </div>

    </div>
  </div>`)
    }
}
function createDepCard(resultArray) {
    for(var i =0; i<resultArray.length; i++){
           
        $('#depCardBox').append(`<div id="${resultArray[i].departmentID}" class="card text-white bg-dark mb-3 depsCard">
        <div class="card-header">
        <button class="btn btn-danger deleteBtn">Delete</button>
        <button class="btn btn-secondary float-right editBtn">Edit</button>
        <button class="btn btn-success float-right hide saveBtn">Save</button>
        </div>
        <div class="card-body text-center">
            <div class="personFull">
                <h5 class="card-title">${resultArray[i].departmentName}</h5>
                <div class="text-center locNameBox">
                    <p class="locName">${resultArray[i].location}</p>
                </div>                   
            </div>
            <div class="personEdit text-left hide">
                <div class="form-group">
                    <input type="text" class="form-control depName" value="" placeholder="Department Name">
                </div>
                <div class="form-group locSelBox">
                    <select class="browser-default custom-select editLocSel"></select>
                </div>
                <div class="w-100 text-center cancel">
                    <button class="btn btn-secondary">Cancel</button>
                </div>                         
            </div>
        </div>
      </div>`)
        }
}
function createLocCard(resultArray){
    for(var i =0; i<resultArray.length; i++){
        $('#locCardBox').append(`<div id="${resultArray[i].id}" class="card text-white bg-dark mb-3 locsCard">
        <div class="card-header">
        <button class="btn btn-danger deleteBtn">Delete</button>
        <button class="btn btn-secondary float-right editBtn">Edit</button>
        <button class="btn btn-success float-right hide saveBtn">Save</button>
        </div>
        <div class="card-body text-center">
        <div class="personFull">
                <h5 class="card-title">${resultArray[i].name}</h5>                     
            </div>
            <div class="personEdit text-left hide">
                <div class="form-group">
                    <input type="text" class="form-control locName" value="" placeholder="Location Name">
                </div>
                <div class="w-100 text-center cancel">
                    <button class="btn btn-secondary">Cancel</button>
                </div>                          
            </div>
        </div>
        </div>`)
        }
}


function createFilterBtn(){
    $('.depcheckBox').change(function(){    
        if($(this).prop("checked") == true) {
          $('#filterResult').append(`<input type="button" class="btn btn-success filters" value="${$(this).val()}" >`)
        departmentFilter.push($(this).val());

        } else if($(this).prop("checked") == false) {
            if ((index = departmentFilter.indexOf($(this).val())) !== -1) {
                departmentFilter.splice(index, 1);
            }
            let unchecked = $(this).val()
            $('.filters').each(function() {
                if($(this).val() == unchecked) {
                    $(this).remove();
                }
            })
        }
        ajaxCall();
    });
    $('.loccheckBox').change(function(){      
        if($(this).prop("checked") == true) {
          $('#filterResult').append(`<input type="button" class="btn btn-success filters" value="${$(this).val()}" >`)
        locationFilter.push($(this).val());
        

        } else if($(this).prop("checked") == false) {
            if ((index = locationFilter.indexOf($(this).val())) !== -1) {
                locationFilter.splice(index, 1);
            }
            let unchecked = $(this).val()
            $('.filters').each(function() {
                if($(this).val() == unchecked) {
                    $(this).remove();
                }
            })
        }
        ajaxCall();
    });
};


function ajaxCall(){

    var locFilterChange = '("' + locationFilter.join('","') + '")';

    var depFilterChange = '("' + departmentFilter.join('","') + '")';

    $('#newLocSelect option, #newDepSelect option, .editLocSel option, .editDepSel option').remove()

    $.ajax({
        url: './libs/php/getAllPerson.php',
        type: 'POST',
        dataType: 'json',
        data: {
            depFilter: depFilterChange, 
            locFilter: locFilterChange,
        },
        success: function(result) {
            if(result.status.code == 200) {
                $('#personsCardBox').html('');
                $('#personNumber').html(result.data.length);
                createPersonCard(result.data);
                editChange();
                saveChange();
                deleteChange();
                cancel();
                $.ajax({
                    url: './libs/php/getTotalDepartment.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function(result) {
                        if(result.status.code == 200) {
                            $('#newDepSelect').append('<option value="none">Choose Department</option>');
                            for(var i = 0; i < result.data.length; i++) {
                                $('#newDepSelect, .editDepSel').append(`<option value="${result.data[i].departmentID}">${result.data[i].departmentName}</option>`)  
                            }              
                        }
                    }
                });
            }
        }
    });
    $.ajax({
        url: './libs/php/getAllDepartments.php',
        type: 'POST',
        dataType: 'json',
        data: {
            depFilter: depFilterChange, 
            locFilter: locFilterChange,
        },
        success: function(result) {
            if(result.status.code == 200) {
                $('#depCardBox').html('');
                $('#depNumber').html(result.data.length);
                createDepCard(result.data);
                editChange();
                saveChange();
                deleteChange();
                cancel();
                $.ajax({
                    url: './libs/php/getTotalLocation.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function(result) {
                        if(result.status.code == 200) {
                            $('#newLocSelect').append('<option value="none">Choose Location</option>');
                            for(var i = 0; i < result.data.length; i++) {
                                $('#newLocSelect, .editLocSel').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`)  
                            }               
                        }
                    }
                });
            }
        }
    });
    $.ajax({
        url: './libs/php/getAllLocation.php',
        type: 'POST',
        dataType: 'json',
        data: {
            depFilter: depFilterChange, 
            locFilter: locFilterChange,
        },
        success: function(result) {
            if(result.status.code == 200) {
                $('#locCardBox').html('');
                $('#locNumber').html(result.data.length);
                createLocCard(result.data);
                editChange();
                saveChange();
                deleteChange();
                cancel();
            }
        }
    });
}


function fill(){

    departmentFilter.splice(0, departmentFilter.length);
    locationFilter.splice(0, locationFilter.length);
    
    $('#depFilterTag').html('');
    $('#locFilterTag').html('');
    $('.filters').remove(); 
    $.ajax({
        url: './libs/php/getTotalDepartment.php',
        type: 'POST',
        dataType: 'json',
        data: {},
        success: function(result) {
            if(result.status.code == 200) {
                for(var i=0; i< result.data.length; i++) {
                    $('#depFilterTag').append(`<table>
                        <tr>
                            <td class="depTable"><input class="depcheckBox" type="checkbox" value="${result.data[i].departmentName}"><span class="filterTitle">${result.data[i].departmentName}</span></td>
                        </tr>
                        </table> `)
                }
                $.ajax({
                    url: './libs/php/getTotalLocation.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {},
                    success: function(result) {
                        
                        if(result.status.code == 200) {
                            for(var i = 0; i < result.data.length; i++){
                                $('#locFilterTag').append(`<table>
                                    <tr>
                                    <td class="locTable"><input class="loccheckBox" type="checkbox" value="${result.data[i].name}"><span class="filterTitle">${result.data[i].name}</span></td>
                                    </tr>
                                    </table> `);
                            };
                            createFilterBtn(); 
                        }
                    }
                });               
            }
        }
    });

}
