const adminPanel = () => {
    $.ajax({
        type: "GET",
        url: 'http://164.90.218.246:8001/api/products',
        success: function (response) {
            $('#totalItems').html('Total products: ' + response.total);
            for (let i = 0; i < response.data.length; i++) {
                console.log(response)
                console.log('response')
                let catsObject = {
                    1: 'Rings',
                    2: 'Bracelets',
                    3: 'Pendants',
                    4: 'Earrings',
                    5: 'Necklaces',
                    6: 'Sets',
                };

                let allItems = document.createElement('div');
                allItems.className = `col-md-12 item_id_${response.data[i].id}`;
                allItems.innerHTML = `<div class="row no-gutters">
<div class="item-actions">
    <div class="edit" data-id="${response.data[i].id}" id="editItem"></div>
    <button type="button" class="close remove" data-id="${response.data[i].id}" id="removeItem" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
<div class="col-md-1" id="idOfProduct"><p>${response.data[i].id}</p></div>
<div class="col-md-2"><p>${response.data[i].title}</p></div>
<div class="col-md-1"><p>${response.data[i].price}</p></div>
<div class="col-md-3"><p>${response.data[i].description}</p></div>
<div class="col-md-1 mr-2"><p>${response.data[i].material}</p></div>
<div class="col-md-1"><p>${response.data[i].code}</p></div>
<div class="col-md-1"><p>${response.data[i].in_stock}</p></div>
<div class="col-md-1" id="categoryId"><p> ${catsObject[response.data[i].category_id]}</p></div>
</div>
<hr> 
`;

                document.querySelector('#allItems').appendChild(allItems);

            }


            const removeProductNew = () => {
                let allRemoveItems = document.querySelectorAll('#removeItem');
                for (let i = 0; i < allRemoveItems.length; i++) {
                    allRemoveItems[i].addEventListener('click', function () {
                        let delItemId = parseInt(allRemoveItems[i].getAttribute('data-id'));
                        swal({
                            title: 'Are you sure?',
                            text: `Do you want delete item with ID: ${delItemId}?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, delete it!'
                        }).then((result) => {
                            if (result) {
                                $.ajax({
                                        type: "DELETE",
                                        url: `http://164.90.218.246:8001/admin/products/${delItemId}`,
                                        headers: {'Authorization': `Bearer ${getCookie('auth_token')}`},
                                        success: function () {
                                            swal(
                                                'Deleted!',
                                                'This product has been deleted.',
                                                'success'
                                            );
                                            setTimeout(function () {
                                                window.location.reload(true)
                                            }, 1500)
                                        },
                                        error: function (jqXHR, textStatus, errorMessage) {
                                            swal(
                                                errorMessage,
                                                'Error.',
                                                'error'
                                            )
                                        }
                                    }
                                );

                            }
                        })
                    })
                }
            };

            removeProductNew();

            const editProductNew = () => {
                let allEditItems = document.querySelectorAll('#editItem');
                for (let i = 0; i < allEditItems.length; i++) {
                    allEditItems[i].addEventListener('click', function () {
                        let editingItemId = parseInt(allEditItems[i].getAttribute('data-id'));

                        $('#myBtn').trigger('click');
                        document.getElementById('editFormTitle').innerHTML = `
<p class="mt-20">
    Editing item with ID: ${editingItemId}
</p>`;

                        $("#editAvailability").on('change', function () {
                            if ($(this).is(':checked')) {
                                $(this).attr('value', true);
                            } else {
                                $(this).attr('value', false);
                            }

                            $('#checkbox-value').text($('#editAvailability').val());
                        });

                        let editItem = document.querySelector('#editProduct');
                        editItem.onclick = () => {
                            let editingProductId = parseInt(allEditItems[i].getAttribute('data-id'));

                            let editItemObj = {
                                titles: {
                                    english: document.getElementById("editItemTitle_en").value,
                                    russian: document.getElementById("editItemTitle_ru").value,
                                    ukrainian: document.getElementById("editItemTitle_ua").value,
                                },
                                descriptions: {
                                    english: document.getElementById("editItemDescr_en").value,
                                    russian: document.getElementById("editItemDescr_ru").value,
                                    ukrainian: document.getElementById("editItemDescr_ua").value,
                                },
                                materials: {
                                    english: document.getElementById("editItemMater_en").value,
                                    russian: document.getElementById("editItemMater_ru").value,
                                    ukrainian: document.getElementById("editItemMater_ua").value,
                                },
                                current_price: parseFloat(document.getElementById("editItemCurrPrice").value),
                                previous_price: parseFloat(document.getElementById("editItemPrevPrice").value),
                                code: document.getElementById("editItemCode").value,
                                category_id: parseInt(document.getElementById("editItemCategory").value),
                                in_stock: JSON.parse(document.getElementById("editAvailability").value),
                            };

                            $.ajax({
                                    type: "PUT",
                                    url: `http://164.90.218.246:8001/admin/products/${editingProductId}`,
                                    data: JSON.stringify(editItemObj),
                                    dataType: "json",
                                    headers: {'Authorization': `Bearer ${getCookie('auth_token')}`},
                                    statusCode: {
                                        200: function () {
                                            swal(
                                                'Changed!',
                                                `Product with id ${editingProductId} was edited`,
                                                'success'
                                            );
                                            setTimeout(function () {
                                                window.location.reload(true)
                                            }, 2000)
                                        }
                                    },
                                    success: function () {
                                        alert('ok');
                                    }
                                }
                            )
                        }
                    })
                }
            };

            editProductNew()
        }

    });


    const addProduct = () => {
        localStorage.clear();
        const addItemBtn = document.querySelector('.add_product');
        const toggleAddInputs = document.querySelector('#toggleAddInputs');

        toggleAddInputs.onclick = () => {
            $('.add-new-items-table').fadeToggle("fast");
            document.querySelector('.add-new-items-table').classList.toggle('d-none');
        };

        addItemBtn.onclick = () => {
            let blobFile = $('#addItemImg')[0].files[0];
            let formData = new FormData();
            formData.append("image", blobFile);

            $.ajax({
                url: "http://164.90.218.246:8001/admin/upload",
                type: "POST",
                headers: {'Authorization': `Bearer ${getCookie('auth_token')}`},
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log(response);
                    localStorage.setItem('uploadedImageId', response.id);

                    let addProductData = {
                        titles: {
                            english: document.getElementById("addItemTitle_en").value,
                            russian: document.getElementById("addItemTitle_ru").value,
                            ukrainian: document.getElementById("addItemTitle_ua").value,
                        },
                        descriptions: {
                            english: document.getElementById("addItemDescr_en").value,
                            russian: document.getElementById("addItemDescr_ru").value,
                            ukrainian: document.getElementById("addItemDescr_ua").value,
                        },
                        materials: {
                            english: document.getElementById("addItemMater_en").value,
                            russian: document.getElementById("addItemMater_ru").value,
                            ukrainian: document.getElementById("addItemMater_ua").value,
                        },
                        current_price: parseFloat(document.getElementById("addItemCurrPrice").value),
                        previous_price: parseFloat(document.getElementById("addItemPrevPrice").value),
                        code: document.getElementById("addItemPrevPrice").value,
                        image_ids: [parseInt(localStorage.getItem('uploadedImageId'))],
                        category_id: parseInt(document.getElementById("addItemCategory").value),
                    };

                    $.ajax({
                        type: "POST",
                        url: 'http://164.90.218.246:8001/admin/products',
                        data: JSON.stringify(addProductData),
                        dataType: "json",
                        headers: {'Authorization': `Bearer ${getCookie('auth_token')}`},
                        statusCode: {
                            200: function () {
                                swal(
                                    'OK!',
                                    `OK`,
                                    'success'
                                );
                                setTimeout(function () {
                                    window.location.reload(true)
                                }, 2000)
                            }
                        },
                        error: function (jqXHR, textStatus, errorMessage) {
                            console.log(addProductData);
                            swal({
                                title: "Error",
                                text: errorMessage,
                                icon: "error",
                                closeOnClickOutside: true,
                                closeOnEsc: true,
                            });
                        }
                    })
                },
                error: function (jqXHR, textStatus, errorMessage) {
                    console.log(errorMessage);
                }
            });
        }
    };

    const toggleModalWindow = () => {
        let modal = document.getElementById("myModal");
        let btn = document.getElementById("myBtn");
        let span = document.getElementsByClassName("close")[0];

        btn.onclick = function () {
            modal.style.display = "block";
        };

        span.onclick = function () {
            modal.style.display = "none";
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    };


    const getAllOrders = () => {
        let ordersWrapper = document.getElementById('listOfAllOrders');

        $.ajax({
            type: "GET",
            url: 'http://164.90.218.246:8001/admin/orders?limit=20&offset=20',
            headers: {'Authorization': `Bearer ${getCookie('auth_token')}`},
            success: function (response) {
                document.getElementById('amountOfOrders').innerText += response.total;
                for (let i = 0; i < response.data.length; i++) {
                    console.log(response);

                    let allOrders = document.createElement('div');
                    allOrders.className = `col-md-12 order_id_${response.data[i].id}`;
                    allOrders.innerHTML = `
<div class="row no-gutters">
    <div class="col-md-1" id="idOfOrder"><p>${response.data[i].id}</p></div>
    <div class="col-md-3"><p>${response.data[i].first_name}</p></div>
    <div class="col-md-3"><p>${response.data[i].last_name}</p></div>
    <div class="col-md-4"><p>${response.data[i].email}</p></div>
    <div class="col-md-1"><p>${response.data[i].total_cost}</p></div>
    <div id="allInfoAboutOrder"></div>
</div>
<hr> 
`;
                    document.querySelector('#listOfAllOrders').appendChild(allOrders);


                    for (let j = 0; j < document.querySelectorAll('#allInfoAboutOrder').length; j++) {
                        for (let k = 0; k < response.data[i].transactions.length; k++) {
                            let moreInfoTransactions = response.data[i].transactions[k];
                            console.log(moreInfoTransactions);

                            let transactionInfo = document.createElement('div');
                            transactionInfo.className = `more_items_hidden`;
                            transactionInfo.innerHTML = `
    <p>Transaction ID: ${moreInfoTransactions.transaction_id}</p>
    <p>Status: ${moreInfoTransactions.status}</p>
    <p>Card mask: ${moreInfoTransactions.card_mask}</p>
    <p>Created at: ${moreInfoTransactions.created_at}</p>
    <hr>
`;

                            document.querySelectorAll('#allInfoAboutOrder')[j].appendChild(transactionInfo);

                        }
                    }
                }
            }
        })
    };

    toggleModalWindow();

    addProduct();
    getAllOrders();
};

if (window.location.pathname === '/admin-panel.html' && getCookie('auth_token') !== null) {
    adminPanel();
}

if (window.location.pathname === '/admin-panel.html' && getCookie('auth_token') === null) {
    document.getElementsByTagName('body')[0].innerHTML = '<div><p class="text-center">You are not logged</p></div>';
    setTimeout(function () {
        window.location.href = '/admin.html'
    }, 2000)
}
