$(document).ready(function() {

    
$('#profile').hide();
$('#new-form').hide();

$('input, select').blur((e) => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
});

$('#first-load').delay(100).fadeOut('slow', function () {        
    $(this).remove();      
}); 

//let userIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="44" height="44" viewBox="0 0 24 24" stroke-width="1" stroke="#6c757d" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>';
let userIcon = '<div id="initials"></div>';
let dots = '<svg xmlns="http://www.w3.org/2000/svg" class="dots" width="44" height="44" viewBox="0 0 24 24" stroke-width="0.8" stroke="#023047" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9" /><line x1="8" y1="12" x2="8" y2="12.01" /><line x1="12" y1="12" x2="12" y2="12.01" /><line x1="16" y1="12" x2="16" y2="12.01" /></svg>';
let controlPanel = '<div id="info"><button id="reset-btn"><svg xmlns="http://www.w3.org/2000/svg" id="reset-icon" width="44" height="44" viewBox="0 0 24 24" stroke-width="1" stroke="#023047" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>clear search</button><p id="records-found"></p></div>';
let buffer = $('<div class="record" id="buffer"></div>');

///////////////////////////////////
// MEDIA QUERIES


let x = window.matchMedia("(max-width: 500px)");
if (x.matches) {
    $('#new-btn').html('+');
}

$(document).on('click', '.record', function(event) {
    let record = $(event.currentTarget);
    if (x.matches) {
        record.css('background-color', '#c9c9c9');
        let id = record.attr('id');
        showProfileMobile(id);
    }
});
    

    
document.addEventListener('click', function (event) {
    if (!event.target.closest('.more-btn')) return;
    let record = $(event.target.closest('.more-btn').parentElement.parentElement);
    let id = record.attr('id');
    showProfile(id);

}, false);
    
$('#new-btn').click(function() {
    if (x.matches) {
        showNewFormMobile();
    } else {
        showNewForm();
    }
});
    
$('#new-cancel-btn').click(function() {
    if (x.matches) {
        resetNewFormMobile();
    } else {
        resetNewForm();
    }
});
    
window.onorientationchange = function(event) {
    x = window.matchMedia("(max-width: 500px)");
    if (x.matches) {
        $('#new-btn').html('+');
    } else {
        $('#new-btn').html('+ Add New');
    }
}
    


///////////////////////////////////////////////////
// REQUESTS ALL PERSONEL AND FILLS RECORDS ON LOAD

function populateAll() {
    $.ajax({
        url: 'libs/php/getAll.php',
        type: 'POST',
        success: function(result) {
            result.data.forEach(function(person) {
                let blankRecord = $(`<div id=${person.id} class="record"></div>`);
                blankRecord.html(`<div class="head-wrapper"><div class="record-initials">${person.firstName[0].toUpperCase()}${person.lastName[0].toUpperCase()}</div><h1 class="name">${person.firstName} ${person.lastName}</h1><button class="more-btn">${dots}</button></div>
                                    <h2>Email</h2>
                                    <p class="email">${person.email}</p>
                                    <h2>Department</h2>
                                    <p class="department">${person.department}</p>
                                    <h2>Location</h2>
                                    <p class="location">${person.location}</p>`);
                $('#results').append(blankRecord);
            });
            displayRecordCount();
            if (x.matches) {
                $('#results').append(buffer);
            }
        }
    });
};
    
function init() {
    $.ajax({
        url: 'libs/php/getAll.php',
        type: 'POST',
        success: function(result) {
            result.data.forEach(function(person) {
                let blankRecord = $(`<div id=${person.id} class="record"></div>`);
                blankRecord.html(`<div class="head-wrapper"><div class="record-initials">${person.firstName[0].toUpperCase()}${person.lastName[0].toUpperCase()}</div><h1 class="name">${person.firstName} ${person.lastName}</h1><button class="more-btn">${dots}</button></div>
                                    <h2>Email</h2>
                                    <p class="email">${person.email}</p>
                                    <h2>Department</h2>
                                    <p class="department">${person.department}</p>
                                    <h2>Location</h2>
                                    <p class="location">${person.location}</p>`);
                $('#results').append(blankRecord);
            });        
            
            displayRecordCount();
            if (x.matches) {
                $('#results').append(buffer);
            }
        }
    });
    
    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'POST',
        success: function(result) {
            let departments = result.data;
            departments.forEach(function(department) {
                let container = $('<div></div>')
                let checkbox = $('<input type="checkbox" class="dep-filter">');
                let label = $('<label></label>');
                checkbox.attr({
                    'id': department.id,
                    'name': department.name
                });
                label.attr('for', department.name).text(department.name);
                container.append(checkbox).append(label);
                $('#department-filter').append(container);  
            });
        }
    });
    
    $.ajax({
        url: 'libs/php/getAllLocations.php',
        type: 'POST',
        success: function(result) {
            let locations = result.data;
            locations.forEach(function(location) {
                let container = $('<div></div>')
                let checkbox = $('<input type="checkbox" class="loc-filter">');
                let label = $('<label></label>');
                checkbox.attr({
                    'id': location.id,
                    'name': locations.name
                });
                label.attr('for', location.name).text(location.name);
                container.append(checkbox).append(label);
                $('#location-filter').append(container);  
            });
        }
    });
}

$(window).on('load', function () {
    
    init();
    
    setTimeout(function() {
        $('.record').remove();
        $('#location-filter').html('');
        $('#department-filter').html('');
        init();
    }, 300);
    
    setTimeout(function() {
        if (!$('.record')[0]) {
            $('.record').remove();
            $('#location-filter').html('');
            $('#department-filter').html('');
            init();
        }
    }, 1000);
    
});

function displayRecordCount() {
    let count = $('.record').length;
    if (count === 1) {
        $('#records-found').html(`${count} record found`);
    } else {
        $('#records-found').html(`${count} records found`);
    }
    
}

//////////////////////////////////////
// SIDE BAR FADE IN ON SHOW

$('#openSidebarMenu').change(function() {
    if ($('#openSidebarMenu')[0].checked) {
        $('#side-contents').fadeIn('fast');
    } else {
        $('#side-contents').fadeOut('fast');
    }
});

///////////////////////////////////////
// SEE MORE BUTTON FUNCTIONALITY 

function showProfile(id) {
    $.ajax({
        url: 'libs/php/getPersonByID.php',
        type: 'POST',
        data: {
            id: id
        },
        success: function(result) {
            if (!($('#profile').css('display') === 'none')) {
                $('#cover').show();
            } 
            let person = result.data[0];
            let firstName = person.firstName,
                lastName = person.lastName,
                email = person.email,
                department = person.department,
                departmentID = person.departmentID,
                location = person.location;
            let initials = firstName[0] + lastName[0];
            $('#profile').removeClass();
            $('#profile').addClass(id);
            $('#initials').text(initials);
            $('#name').text(firstName + ' ' + lastName);
            $('#email').text(email);
            $('#department').text(department).removeClass().addClass(departmentID);
            $('#location').text(location);
            
            resetProfile();
            $('#cover').show();
            
            $('#profile').fadeIn();
            $('#cover').fadeOut(800);
        }
    });
}

function showProfileMobile(id) {
    $.ajax({
        url: 'libs/php/getPersonByID.php',
        type: 'POST',
        data: {
            id: id
        },
        success: function(result) {
            let person = result.data[0];
            let firstName = person.firstName,
                lastName = person.lastName,
                email = person.email,
                department = person.department,
                departmentID = person.departmentID,
                location = person.location;
            let initials = firstName[0] + lastName[0];
            $('#profile').removeClass().addClass(id);
            $('#initials').text(initials);
            $('#name').text(firstName + ' ' + lastName);
            $('#email').text(email);
            $('#department').text(department).removeClass().addClass(departmentID);
            $('#location').text(location);
            
            resetProfile();
            $('#profile').fadeIn('fast');
            $('#profile').css('transform', 'translateX(0)');
            slideAllLeft();
        }
    });
}

function slideAllLeft() {
    $('header').css('transform', 'translateX(-100vw)');
    $('#results').css('transform', 'translateX(-100vw)');
    $('.spinner').css('transform', 'translateX(-100vw)');
    $('#side-bar').hide();
}

function slideAllRight() {
    $('header').css('transform', 'translateX(0)');
    $('#results').css('transform', 'translateX(0)');
    $('.spinner').css('transform', 'translateX(0)');
    $('#side-bar').delay(400).fadeIn(350);
}

////////////////////////////////////////
// PROFILE CLOSE BUTTON

document.addEventListener('click', function (event) {
	if (!event.target.closest('#close-btn')) return;
    $('#cover').show();
	$('#profile').fadeOut('fast');
    resetProfile();
}, false);

document.addEventListener('click', function (event) {
	if (!event.target.closest('#mobile-close-btn')) return;
	$('#profile').css('transform', 'translateX(100vw)');
    $('#profile').fadeOut('slow');
    slideAllRight();
    resetProfile();
    $('.record').css('background-color', '#fafafa');
}, false);

document.addEventListener('click', function (event) {
	if (!event.target.closest('#mobile-close-new-form-btn')) return;
	closeNewFormMobile();
}, false);

function closeNewFormMobile() {
    $('#new-form').fadeOut();
    $('#new-form').css('transform', 'translateX(100vw)');
    $('header').css('transform', 'translateX(0)');
    $('#results').css('transform', 'translateX(0)');
    $('.spinner').css('transform', 'translateX(0)');
    $('#side-bar').delay(400).fadeIn(350);
    resetNewFormMobile();
}

///////////////////////////////////////
// EDIT RECORD BUTTON

$('#edit-btn').click(function(e) {
    $('#email-input').val($('#email').text()).fadeIn().focus();
    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'POST',
        success: function(result) {
            $('#dep-input').html('');
            let departments = result.data;
            departments.forEach(function(department) {
                let option = $('<option></option>');
                option.attr({
                    value: department.id,
                });
                option.text(department.name);
                $('#dep-input').append(option);
            });
            $('#dep-input').val($('#department').attr('class'));
        }
    });
    $('#dep-input').fadeIn();
    $('#ctrl-btns').fadeOut();
    $('#edit-ctrl-btns').css('opacity', '1');
})

/////////////////////////////////////////
// CORRECTS LOCATION ON DEPARTMENT CHANGE
function updateLocation(depId, locId) {
    let id;
    if (depId === '#department') {
        id = $(depId).attr('class');
    } else {
        id = $(depId).val();
    }
    
    $.ajax({
        url: 'libs/php/getLocationByDepartmentID.php',
        type: 'POST',
        data: {
            id: id
        },
        success: function(result) {
            let location = result.data[0].location;
            $(locId).text(location);
        }
    })
}

$('#dep-input').change(function() {
    updateLocation('#dep-input', '#location');
});

////////////////////////////////////////////
// CANCEL EDIT BUTTON
function resetProfile() {
    $('#email-input').fadeOut();
    $('#dep-input').fadeOut();
    $('#ctrl-btns').fadeIn();
    $('#edit-ctrl-btns').css('opacity', '0');
}


$('#cancel-btn').click(function() {
    resetProfile();
    updateLocation('#department', '#location');
});

///////////////////////////////////////////
// SAVE EDIT

$('#save-btn').click(function() {
    if (!$('#email-input').val()) {
        Swal.fire({
            title: 'Please enter a valid email',
            confirmButtonColor: '#54ab64'
        });
    } else {
        let emailEdit = $('#email-input').val();
        let id =  $('#profile').attr('class');
        let departmentEdit = $('#dep-input').val();
        
        Swal.fire({
            title: 'Are you sure you want to save these changes?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#54ab64',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save'
        }).then((result) => {
            if (result.isConfirmed) {
                
                $.ajax({
                    url: 'libs/php/editPerson.php',
                    type: 'POST',
                    data: {
                        id: id,
                        email: emailEdit,
                        department: departmentEdit
                    },
                    success: function(result) {
                        Swal.fire(
                            'Saved!',
                            'Your changes have been saved.',
                            'success'
                        )
                        
                        $('#email').html($('#email-input').val());
                        $('#department').html($('#dep-input')[0].options[$('#dep-input')[0].selectedIndex].text);
                        $('#department').removeClass().addClass($('#dep-input').val());
                        resetProfile();
                        $('#results-load').show();
                        $('#results-load').delay(100).fadeOut('slow');
                        $('.record').remove();
                        populateAll();
                    }
                })
        
            }
        })
        
        
    }
});

/////////////////////////////////////////////
// DELETE RECORD BUTTON

$('#delete-btn').click(function() {
    Swal.fire({
            title: 'Are you sure you want to delete this record?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#54ab64',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.isConfirmed) {
                let id = $('#profile').attr('class');
                $.ajax({
                    url: 'libs/php/deletePerson.php',
                    type: 'POST',
                    data: {
                        id: id
                    },
                    success: function(result) {
                        Swal.fire(
                            'Deleted!',
                            'This record has been deleted.',
                            'success'
                        ).then(() => {
                            resetProfile();
                            if (x.matches) {
                                $('#profile').css('transform', 'translateX(100vw)');
                                $('#profile').fadeOut('slow');
                                slideAllRight();
                            } else {
                                $('#cover').show();
                                $('#profile').fadeOut('fast');
                            }
                            $('#results-load').show();
                            $('#results-load').delay(100).fadeOut('slow');
                            $('.record').remove();
                            populateAll();
                        })
                    }
                })
        
            }
        })
})

////////////////////////////////////////////
// SEARCH BAR

$('#search').on('focus', function() {
    $('#search-container').css({
        'box-shadow': 'inset 3px 3px 5px 0 rgba(0, 0, 0, .3)',
        'background': '#fff'
    });
}).on('blur', function() {
    $('#search-container').css({
        'box-shadow': '',
        'background': '#fff'
    });
})

$('#search').keydown(function(e) {
    if (e.which === 13) {
        $('.dep-filter').toArray().forEach(function(check) {
            check.checked = false;
        });
        $('.loc-filter').toArray().forEach(function(check) {
            check.checked = false;
        });
        $('#openSidebarMenu')[0].checked = false;
        $('#side-contents').fadeOut('fast');
        let search = `%${$('#search').val()}%`;
        let query = `WHERE p.firstName LIKE "${search}" OR p.lastName LIKE "${search}" OR l.name LIKE "${search}" OR d.name LIKE "${search}"`;
        $.ajax({
            url: 'libs/php/searchDatabase.php',
            type: 'POST',
            data: {
                query: query
            },
            success: function(result) {
                populate(result.data);
            }
        });
    }
    
});

//////////////////////////////////////
// SIDEBAR REFINE SEARCH

function populate(dataArr) {
    $('#results-load').show();
    $('#results-load').delay(100).fadeOut('slow');
    $('.record').remove();
    
    dataArr.forEach(function(person) {
        let blankRecord = $(`<div id=${person.id} class="record"></div>`);
        blankRecord.html(`<div class="head-wrapper"><div class="record-initials">${person.firstName[0].toUpperCase()}${person.lastName[0].toUpperCase()}</div><h1 class="name">${person.firstName} ${person.lastName}</h1><button class="more-btn">${dots}</button></div>
                                    <h2>Email</h2>
                                    <p class="email">${person.email}</p>
                                    <h2>Department</h2>
                                    <p class="department">${person.department}</p>
                                    <h2>Location</h2>
                                    <p class="location">${person.location}</p>`);
        $('#results').append(blankRecord);
    });
    displayRecordCount();
    if (x.matches) {
        $('#results').append(buffer);
    }
}

function populateResults(queryString) {
    $.ajax({
        url: 'libs/php/getPeopleByLocationOrDepartment.php',
        type: 'POST',
        data: {
            query: queryString 
        },
        success: function(result) {
            result.data.forEach(function(person) {
                let blankRecord = $(`<div id=${person.id} class="record"></div>`);
                blankRecord.html(`<div class="head-wrapper"><div class="record-initials">${person.firstName[0].toUpperCase()}${person.lastName[0].toUpperCase()}</div><h1 class="name">${person.firstName} ${person.lastName}</h1><button class="more-btn">${dots}</button></div>
                                    <h2>Email</h2>
                                    <p class="email">${person.email}</p>
                                    <h2>Department</h2>
                                    <p class="department">${person.department}</p>
                                    <h2>Location</h2>
                                    <p class="location">${person.location}</p>`);
                $('#results').append(blankRecord);
            });
            displayRecordCount();
            if (x.matches) {
                $('#results').append(buffer);
            }
        }
    });
}

$('#side-bar').on('click', function (event) {
	if (!(event.target.closest('.dep-filter') || event.target.closest('.loc-filter'))) return;
    
    $('#results-load').show();
    $('#results-load').delay(100).fadeOut('slow');
    
    let departmentFilters = $('.dep-filter').toArray();
    let locationFilters = $('.loc-filter').toArray();
    let activeDepartments = [];
    let activeLocations = [];
    departmentFilters.forEach(function(department) {
        if (department.checked) {
            activeDepartments.push(department.id);
        }
    });
    locationFilters.forEach(function(location) {
        if (location.checked) {
            activeLocations.push(location.id);
        }
    });
    
    $('.record').remove();
    
    let activeDepString = 'WHERE d.id = ';
    for (let i = 0; i < activeDepartments.length; i++) {
        if (i !== activeDepartments.length - 1) {
            activeDepString += (activeDepartments[i] + ' OR d.id = ');
        } else {
            activeDepString += activeDepartments[i];
        }
    }; 
    
    let activeLocString = 'WHERE l.id = ';
    for (let i = 0; i < activeLocations.length; i++) {
        if (i !== activeLocations.length - 1) {
            activeLocString += (activeLocations[i] + ' OR l.id = ');
        } else {
            activeLocString += activeLocations[i];
        }
    }; 
    
    let activeCombinedString = activeDepString + ' OR ' + activeLocString.slice(6);
    
    if (!activeDepartments[0] && !activeLocations[0]) {
        populateAll();
    } else if (!activeDepartments[0] && activeLocations[0]) {
        populateResults(activeLocString);
    } else if (activeDepartments[0] && !activeLocations[0]) {
        populateResults(activeDepString);
    } else {
        populateResults(activeCombinedString);
    }
        
});

$('#results').click(function() {
    $('#openSidebarMenu')[0].checked = false;
    $('#side-contents').fadeOut('fast');
})

/////////////////////////////////
// CLEAR SEARCH BUTTON
function refreshData() {
    $('#results-load').show();
    $('#results-load').delay(100).fadeOut('slow');
    $('.record').remove();
    populateAll();
    $('#search').val('');
    $('.dep-filter').toArray().forEach(function(check) {
        check.checked = false;
    });
    $('.loc-filter').toArray().forEach(function(check) {
        check.checked = false;
    });
}

$('#reset-btn').click(function() {
        
    refreshData();
});

////////////////////////////
// NEW RECORD BUTTON 

function showNewForm() {
    $('#new-form').fadeIn();
    $('#new-first-name').focus();
    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'POST',
        success: function(result) {
            $('#new-department').html('<option disabled selected value>-- select a department --</option>');
            let departments = result.data;
            departments.forEach(function(department) {
                let option = $('<option></option>');
                option.attr({
                    value: department.id,
                });
                option.text(department.name);
                $('#new-department').append(option);
            });
        }
    });
}

function showNewFormMobile() {
    $('header').css('transform', 'translateX(-100vw)');
    $('#results').css('transform', 'translateX(-100vw)');
    $('.spinner').css('transform', 'translateX(-100vw)');
    $('#side-bar').hide();
    $('#new-form').fadeIn('fast');
    $('#new-form').css('transform', 'translateX(0)');
    $.ajax({
        url: 'libs/php/getAllDepartments.php',
        type: 'POST',
        success: function(result) {
            $('#new-department').html('<option disabled selected value>-- select a department --</option>');
            let departments = result.data;
            departments.forEach(function(department) {
                let option = $('<option></option>');
                option.attr({
                    value: department.id,
                });
                option.text(department.name);
                $('#new-department').append(option);
            });
        }
    });
}

$('#new-department').change(function() {
    updateLocation('#new-department', '#new-location');
});

$('#new-save-btn').click(function() {
    if (!$('#new-first-name').val() || !$('#new-last-name').val() || !$('#new-email').val() || !$('#new-department').val()) {
        Swal.fire({
            title: 'Please fill out each field before saving.',
            confirmButtonColor: '#54ab64'
        });
    } else {
        
        Swal.fire({
            title: 'Are you sure you want to add this to the database?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#54ab64',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save'
        }).then((result) => {
            if (result.isConfirmed) {
                
                $.ajax({
                    url: 'libs/php/getPersonCount.php',
                    type: 'POST',
                    success: function(result) {
                        let id = parseInt(result.data[0]['COUNT(*)']) + 1;
                        $.ajax({
                            url: 'libs/php/saveNewRecord.php',
                            type: 'POST',
                            data: {
                                id: id,
                                firstName: $('#new-first-name').val(),    
                                lastName: $('#new-last-name').val(),
                                email: $('#new-email').val(),
                                department: $('#new-department').val()
                            },
                            success: function(result) {
                                Swal.fire(
                                    'Saved!',
                                    'Successfully added to the database.',
                                    'success'
                                );  
                                $('#results-load').show();
                                $('#results-load').delay(100).fadeOut('slow');
                                if (x.matches) {
                                    $('#new-form').css('transform', 'translateX(100vw)');
                                    $('#new-form').fadeOut('slow');
                                    slideAllRight();
                                    showProfileMobile(id.toString());
                                } else {
                                    showProfile(id.toString());
                                    $('#new-form').hide();
                                }
                                resetNewForm();
                                $('.record').remove();
                                populateAll();
                            }
                        })
                    }
                });
        
            }
        })
        
        
    }
});   

function resetNewForm() {
    $('#new-form').fadeOut();
    $('#new-first-name').val('');
    $('#new-last-name').val('');
    $('#new-email').val('');
    $('#new-department').val('-- select a department --');
    $('#new-location').text('');
}

function resetNewFormMobile() {
    $('#new-first-name').val('');
    $('#new-last-name').val('');
    $('#new-email').val('');
    $('#new-department').val('-- select a department --');
    $('#new-location').text('');
}



/*$.ajax({
    url: 'libs/php/deleteNullRows.php',
    type: 'POST',
    success: function(result) {
        console.log(result);
    }
})*/


});














