$("#searchClick").click(() =>{
    let query = $("#search").val();
    if(query){
        console.log(query);
        window.location.href = "/search/query?query=" + query;
    }
    
});

$('form.autocomplete').submit(function(){
    let query = $("#search").val();
    if(query){
        console.log(query);
        window.location.href = "/search/query?query=" + query;
    }
});