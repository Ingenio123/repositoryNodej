const  portafolio__teacher = document.getElementsByClassName('portafolio__teacher');
// let  additems = document.getElementsByClassName('additems');

let url = 'http://localhost:4000/data/getAllTeachers/'
fetch(url)
    .then(res => res.json())
    .then(data => mostrarData(data.teachers))

const mostrarData = (data)=>{
    console.log(data);
    let body = '' ;

    for(i=0;i<data.length; i++){
        console.log(data[i].firstName)
        body += `
         
            <!-- Team member -->
            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                    <div class="mainflip">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <p><img class=" img-fluid" src="${data[i].imageUrl}" alt="card image"></p>
                                    <h4 class="card-title"> ${data[i].firstName} </h4>
                                    <p class="card-text"> ${data[i].eslogan } </p>
                                    <a href="#" class="btn btn-plus btn-sm">
                                          <i class="fa fa-plus"></i>
                                      </a>
                                </div>
                            </div>
                        </div>
                        <div class="backside">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title"> ${data[i].firstName} </h4>
                                    <p class="card-text"> ${data[i].description} </p>
                                    <a href="http://localhost:3000/teacher"    class="btn-conoce-more" style="color: white;">Conoce mas <i class="fa fa-arrow-right" aria-hidden="true"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ./Team member -->
        `
    }



    
    document.getElementById('teamCard').innerHTML =  body;
}
