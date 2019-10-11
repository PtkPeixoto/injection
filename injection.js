(function() {
    window.tmdb = {
        "api_key": "a903efe5e05d831d95718647dca2d1eb",
        "base_uri": "http://api.themoviedb.org/3",
        "images_uri": "http://image.tmdb.org/t/p",
        "timeout": 5000,
        call: function(url, params, success, error) {
            var params_str = "api_key=" + tmdb.api_key;
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    params_str += "&" + key + "=" + encodeURIComponent(params[key]);
                }
            }
            var xhr = new XMLHttpRequest();
            xhr.timeout = tmdb.timeout;
            xhr.ontimeout = function() {
                throw ("Request timed out: " + url + " " + params_str);
            };
			
			console.log(tmdb.base_uri + url + "?language=pt-BR&" + params_str);
			
            xhr.open("GET", tmdb.base_uri + url + "?language=pt-BR&" + params_str, true);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.responseType = "text";
            xhr.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        if (typeof success == "function") {
                            success(JSON.parse(this.response));
                        } else {
                            throw ('No success callback, but the request gave results')
                        }
                    } else {
                        if (typeof error == "function") {
                            error(JSON.parse(this.response));
                        } else {
                            throw ('No error callback')
                        }
                    }
                }
            };
            xhr.send();
        }
    }
})();


movie_name.onblur = function() {


    setTimeout(function() {
        var campo = movie_name.value.split('|');
		/* Se for série */
        if (campo.length > 2) {
            var serie = campo[0];
            var temp = campo[1];
            var ep = campo[2];

            tmdb.call("/tv/" + serie + "/season/" + temp + "/episode/" + ep, {},
                function(e) {
					
					console.log(e.crew);
					
					if(temp < 10){
						temp = '0'+temp;
					}
					if(temp < 10){
						ep = '0'+ep;
					}
					
                    /*console.log("Success: "+e.title);*/
                    movie_name.value = 'T'+temp+' E'+ep+' - '+e.name;
                    movie_image_text.value = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + e.still_path;
                    

                    genre.value = "";
                    cast.value = "";
					
                    var arr = e.crew;
                    for (var key in arr) {
						if(e.crew[key]['job'] == 'Director' || e.crew[key]['job'].job == 'director'){
							document.getElementById('director').value = e.crew[key]['name'];
						}
                        
                    }
					


                    plot.value = e.overview;

                    /*cast.value = e.vote_average;*/
                    rating.value = e.vote_average;
                    releasedate.value = e.air_date;

                },
                function(e) {
                    /*console.log("Error: "+e)*/
                }
            )
            movie_propeties.style.display = 'block';
			
			/* Se for Filme */
        } else {
            tmdb.call("/movie/" + movie_name.value, {},
                function(e) {
                    /*console.log("Success: "+e.title);*/
                    movie_name.value = e.title;
                    movie_image_text.value = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + e.poster_path;
                    genre.value = e.genres.join(', ');

                    genre.value = "";
                    var arr = e.genres;
                    for (var key in arr) {
                        if (arr.hasOwnProperty(key)) {

                            // Printing Keys 
                            genre.value += e.genres[key]['name'] + ' / ';
                        }
                    }


                    plot.value = e.overview;

                    /*cast.value = e.vote_average;*/
                    rating.value = e.vote_average;
                    releasedate.value = e.release_date;

                },
                function(e) {
                    /*console.log("Error: "+e)*/
                }
            )
        }

    }, 2000);

};