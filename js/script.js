const fileInput = document.querySelector(".file-input"), /*Para seleccionar la carpeta donde guardan las imagenes*/
filterOptions = document.querySelectorAll(".filter button"), /*Para el boton de efecto o filtro*/
filterName = document.querySelector(".filter-info .name"), /*El nombre de la variable del efecto*/
filterValue = document.querySelector(".filter-info .value"), /*El pocentaje que toma el control deslizante*/
filterSlider = document.querySelector(".slider input"), /*Todos los valores que puede tomar el control deslizante*/
rotateOptions = document.querySelectorAll(".rotate button"), /*Los botones girar*/
previewImg = document.querySelector(".preview-img img"), /*Para tomar la imagen seleccionada*/ 
resetFilterBtn = document.querySelector(".reset-filter"), /*El boton resetear, volver a la imagen original*/
chooseImgBtn = document.querySelector(".choose-img"), /*El boton para seleccionar las imagenes*/
saveImgBtn = document.querySelector(".save-img"); /*El boton guardar*/
let brightness = "100", saturation = "100", inversion = "0", grayscale = "0"; /*inicializar*/
let rotate = 0, flipHorizontal = 1, flipVertical = 1;
/*Accede a la carpeta y puede tomar la imagen seleccionada*/
const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return; /*Develve si no se selecciono una imagen, (!= false)*/
    previewImg.src = URL.createObjectURL(file); /*Para que la foto seleccionada aparezca en la pagina,le pasa el url*/
    previewImg.addEventListener("load", () => { /*Para que ande los efectos luego de subir la imagen*/
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}
/*Va guardando los valores en la vaiable cada vez que produce un cambio*/
const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

/*Para que ande el boton de efecto*/
filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;
        if(option.id === "brightness") {
            filterSlider.max = "200"; /*El maximo valor que puede tener*/
            filterSlider.value = brightness; /*Valor de inicio*/
            filterValue.innerText = `${brightness}%`; /*Toma el valor seleccionado*/
        } else if(option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`
        } else if(option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

/*Para darle valor numerico con el control deslizante*/
const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");
    if(selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilter(); /*Invoca applyFilter*/ 
}

/*Botones girar y dar vuelta*/
rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left") {
            rotate -= 90; /*gira 90 grados hacia la izquierda,decrementa 90*/
        } else if(option.id === "right") {
            rotate += 90; /*gira 90 grados hacia la derecha,aumenta 90*/
        } else if(option.id === "horizontal") {
            /*Voltear en foma horizontal: si flipHorizontal es 1, setear en -1,sino setear en 1*/
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            /*Voltear en forma vertical: si flipVertical es 1, setear en -1,sino setear en 1*/
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    });
});

/*Vuelve a inicializar todas las variables*/
const resetFilter = () => {
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click();
    applyFilter();
}

/**/
const saveImage = () => {
    const canvas = document.createElement("canvas"); /*Crea elemento canvas, es lo que se va bajar en la compu*/
    const ctx = canvas.getContext("2d"); /*getContext retorna un contexto de dibujo en canvas*/
    canvas.width = previewImg.naturalWidth; /*Ajustar el ancho de canvas al actual imagen guardado*/
    canvas.height = previewImg.naturalHeight; /*Ajustar el alto de canvas al actual imagen guardado*/
    /*Aplicar filtros seleccionados por el usuario al filtro de canvas*/
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2); //Traducir canvas desde el centro
    if(rotate !== 0) { //Si rotate distinto de cero, gira el canvas
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical); /*Dar vuelta el canvas horizontalmente o verticalmente*/
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a"); //Pasando el valor de la etiqueta <a> a image.jpg
    link.download = "image.jpg";
    link.href = canvas.toDataURL(); //Pasar el valor href de la etiqueta <a> a la URL de datos del canvas
    link.click(); //haciendo clic en la etiqueta <a> para que la imagen se descargue
}
filterSlider.addEventListener("input", updateFilter); /*El valor que le da el control deslizante*/
resetFilterBtn.addEventListener("click", resetFilter); /*Cuando hace click en el boton resetear, inicializa*/
saveImgBtn.addEventListener("click", saveImage); /*Cuando hace click en el boton guardar hace download*/
fileInput.addEventListener("change", loadImage); /*Para tomar la imagen seleccionada desde la carpeta*/
chooseImgBtn.addEventListener("click", () => fileInput.click()); /*Hace que el boton elegir pueda acceder a la carpeta de imagenes*/