


$("#add_user").submit(function (event) {
    alert("Data Inserted Successfully!");
})

$("#update_user").submit(function (event) {
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function (n, i) {
        data[n['name']] = n['value']
    })


    var request = {
        "url": `https://lsa-db.fly.dev/api/users/${data.id}`,
        "method": "PUT",
        "data": data
    }

    $.ajax(request).done(function (response) {
        alert("Data Updated Successfully!");
    })

})

if (window.location.pathname == "/") {
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function () {
        var id = $(this).attr("data-id")

        var request = {
            "url": `https://lsa-db.fly.dev/api/users/${id}`,
            "method": "DELETE"
        }

        if (confirm("Do you really want to delete this record?")) {
            $.ajax(request).done(function (response) {
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })
}

$("#customImport").click(function () {
    $("#real-import").click()
})

$("#real-import").change(function () {
    $fname = $('input[type=file]').val().replace(/.*(\/|\\)/, '');
    // alert($fname)
    $("#fileName").html($fname)
    $("#fileName").removeAttr("hidden")
    $("#customSubmit").removeAttr("hidden")
})

$("#customSubmit").click(function () {
    $("#real-submit").click()
})
