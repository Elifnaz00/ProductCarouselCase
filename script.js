(() => {
    if(window.location.href == 'https://www.e-bebek.com/' )
    {
        init(); 
    }
    else{
        console.log("wrong page")   
    }

  
    function init() {
        mainHtml();
        dataControl();
        createCss();
        setEvents();

    }

    const mainHtml = () =>{
        const htmlStructure = `
         <button id="prev" class="btn-scroll"><i class="fa-solid fa-chevron-left"></i> </button>
         <button id="next" class="btn-scroll"><i class="fa-solid fa-chevron-right"></i> </button>
        <div class="our-picks">
             <div class="slider-container">
            <div class="banner-titles">
                <h3 class="carousel-title">Beğenebileceğinizi düşündüklerimiz</h3>
            </div>
            <div class="banner-wrapper">
             <div class="slider">
                   
            </div>
            </div>  
        </div>
        </div>
      `;

      $("body").append(htmlStructure);
        
    }


    const dataControl= () =>{
        
        let localStorageValue= JSON.parse(localStorage.getItem("products"));
        if(!localStorageValue){
            getFetchData();
        }
        else{
            
            createHtml(localStorageValue);          
        }
    }

    
    const getFetchData =() =>{
        fetch('https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json')
        .then(response => {
            if (response.ok) {
                return response.json(); 
            } else {
                throw new Error('Response 200 dönmedi!'); 
            }
        })
        .then(data => {
            createHtml(data);
            localStorageAddProductData(data);

        })
        .catch(error => console.error('Hata!', error));
    }
 

    const createHtml = (data) =>{
        data.forEach(element => {
                    
           const discount=  priceContent(element.price, element.original_price);
           const htmlContent = renderProductCard(element, discount);
          

           $(".slider").append(htmlContent);

           if (discount === 0) {
            $(`#${element.id}`).closest('.product-item').find('.price-container').addClass('hidden');
        }
          
        });  
    }


    const renderProductCard = (element, discount) => {
        
        return `
        <div class="product-item">
            <div class="product-card">
                 <div class="favorite-icon-container">
                     <span id="${element.id}" class="material-symbols-outlined favorite-icon">favorite</span>
                 </div>
                 <div>
                     <a href=${element.url} target="_blank" rel="noopener">
                     <div class="img-container">
                     <img src="${element.img}" alt="${element.name}">
                 </div>
                 <div class="product-title">
                     <span class="product-card-title"><span class="product-brand">${element.brand}</span> -${element.name}</span>
                 </div>
                 <div class="product-content">
                     <div class="product-rating-container">
                         <div class="product-rating">
                             <span class="fa fa-star star-checked"></span>
                             <span class="fa fa-star star-checked"></span>
                             <span class="fa fa-star star-checked"></span>
                             <span class="fa fa-star star-unchecked" ></span>
                             <span class="fa fa-star star-unchecked" ></span> 
                         </div> 
                         <div>
                             <span>(120)</span>
                         </div>
                     </div> 
                 <div class="product-price">
                     <div class="price-container">
                        <span class="old-price"> ${element.original_price}TL</span>
                        <span class="discount-price"> % ${discount} </span>   
                      </div>
                     <div class="price">
                         <span class="new-price">${element.price} TL</span>                    
                     </div>
                 </div>
                 <div class="offer-container">
                     <span class="offer">Farklı Ürünlerde 3 Al 2 Öde</span></div>
                 </div>  
                 </div>    
                 <div class="add-btn">
                     <button class="add-cart-btn">Sepete Ekle</button>
                 </div>
             </div>
        </div>
         ` 
    }    

    const priceContent = (newPrice, oldPrice) =>{
        return newPrice !== oldPrice ? Math.abs(Math.round(((oldPrice - newPrice) / oldPrice) * 100)) : 0;
       
    }


    const localStorageAddProductData = (productData) =>{
        localStorage.setItem("products", JSON.stringify(productData));

    }


    const setEvents = () =>{  

    $(document).on( "click", ".favorite-icon",function(event) {
        event.stopPropagation();
      
            const favoritedProductId = $(this).attr("id");
            const localStorageProducts = JSON.parse(localStorage.getItem("products")) || [];
            const productData = localStorageProducts.find(product => product.id == favoritedProductId);
        
            let localStorageFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        
            const isFavorited = localStorageFavorites.some(product => product.id == favoritedProductId);
        
            if (isFavorited) {
             
                localStorageFavorites = localStorageFavorites.filter(product => product.id !== favoritedProductId);
                $(this).toggleClass("favorited");
            } else {
              
                localStorageFavorites.push(productData);
                $(this).toggleClass("favorited");
            }
        
            localStorage.setItem("favorites", JSON.stringify(localStorageFavorites));

    })


    $(document).on( "click", "#next",function() {
        let productCard= document.querySelector(".product-card");
        let slider= document.querySelector(".slider");
   
        slider.scrollLeft += productCard.offsetWidth + 62;
         
    })


    $(document).on( "click", "#prev",function() {
        let productCard= document.querySelector(".product-card");
        let slider= document.querySelector(".slider");
        
        slider.scrollLeft -= productCard.offsetWidth + 62;
    })
;}


const createCss = () =>{
    const css=`

    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css");
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=favorite');
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');


    *{
    box-sizing: border-box;
    }

    body{
    margin:0;
    padding: 0;
    font-family: Quicksand-Medium;
    font-size: 1rem;
    line-height: 1.6;
    text-align: start;
    color: #212738;
    }

    .slider-container{
     max-width: 1300px;
     margin-right: auto;
     margin-left: auto;
     padding: 0px 15px 0px 15px;
    
    }
   
    .slider{
    display: flex;
    overflow-x: auto;
    overflow: hidden;  
    scroll-behavior: smooth;   
    }

    .product-card{
    margin: 0px 9px 0px 9px;
    display:flex;
    flex-direction: column;
    min-width: 200px;
    height: auto;
    position: relative;
    font-size: 12px;
    }

    .img-container{
    width: 100%;
    height: 200px;
    margin-bottom: 50px;
    }

    .product-card .img-container img{
    object-fit: cover;
    width: 100%;
    height: 100%;
    }
    
    .star-checked{
    color: #fed100;;
    }
    .star-unchecked{
    color: #e9e9e9;
    }

    .product-rating-container{
    display:flex;
    gap: 6px;
    height: 22px;
    }

    .product-rating span{
     margin: 0 2.5px;
     font-size: 14px;  
    }

    .product-content{
    display: flex;
    flex-direction: column;
    align-items: space-around;
    }

    .product-title{
    font-size: 1.2rem;
    height: 52px;
    overflow: hidden;
    margin-bottom: 10px;
    line-height: 0.7rem;
    }

    .product-price{
    display:flex;
    flex-direction: column;
    }

    a{
     text-decoration: none;
    
    }

    a:link {
  color: #212738;
}

    a:visited {
  color: #212738;
}

    .old-price{
    text-decoration:line-through;
    font-size: 1rem;
    font-weight: 500;
    }

   .offer{
   background: #eaf8f3;
   border-radius: 25px;
   color: #4bb788;
   padding: 5.5px 9px 4.5px;
   font-weight: 600;
   font-size: 0.7rem;
   }

   .offer-container{
   height: 90px;
   margin-top: 20px;
   }

   .add-btn{
    position: relative;
    margin: auto;
    }

   .add-cart-btn{
  
   border-radius: 37.5px;
   color: #f28e00;
   background-color: #fff7ec;
   border: 1px solid #0000;
   width: 100%;
   padding: 12px 20px;
   font-family: Poppins, "cursive";
   font-size: 0.9rem;
   font-weight: 700;
   }
   
   .favorite-icon-container{
   position: absolute;
   right: 3px;
   top: 3px;
    cursor: pointer;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 #00000024;
    width: 50px;
    height: 50px;
   }

   .favorite-icon {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 13px;
    right: 12px;
    color: orange; 
    -webkit-text-stroke: 0.2px orange; 
    font-variation-settings:
        'FILL' 0, 
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}

   
    .favorited {
        color: orange; 
        -webkit-text-stroke: 0px; 
        font-variation-settings:
            'FILL' 1, 
            'wght' 400,
            'GRAD' 0,
            'opsz' 24;
    }

    .btn-scroll{
    position: absolute;
    font-size: 25px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    position: absolute;
    bottom: 50%;
    top: auto;
    color: #f28e00; 
    border:none;
    background-color: #fef6eb;
 }

    #prev{ 
    z-index: 9851;
    left: 65px;
    }

    #next{
    right: 65px;
    z-index: 9851;
    }

    .banner-titles{
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fef6eb;
    border-top-left-radius: 35px;
    border-top-right-radius: 35px;
    font-family: Quicksand-Bold;
    font-weight: 700;
    }

    .carousel-title{
    font-family: Quicksand-Bold;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.11;
    color: #f28e00;
    margin: 0;
    padding: 25px 67px 25px 67px;
    }

    .our-picks{
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    height: 100vh;
    }

    .banner-wrapper{
    box-shadow: 15px 15px 30px 0 #ebebeb80;
    background-color: #fff;
    border-bottom-left-radius: 35px;
    border-bottom-right-radius: 35px;
    position: relative;
    margin-top: 20px;
    }

    .product-item{
    margin-top: 20px;
    z-index: 1;
    display: block;
    font-family: Poppins, "cursive";
    font-size: 12px;
    color: #7d7d7d;
    margin: 0 20px 20px 0px;
    border: 1px solid #ededed;
    border-radius: 10px;
    position: relative;
    text-decoration: none;
    background-color: #fff;
    padding: 10px;

    }
    .product-container{
    padding: 2px;
    }

    .price-container{
    display: flex !important;
    align-items: center !important;
    width: 100%;
    }

    .hidden{
    visibility: hidden;
    }

    .discount-price{
    color: #00a365;
    font-size: 18px;
    font-weight: 700;
    display: inline-flex;
    justify-content: center;
    margin-left: 10px;
    }

    .new-price{
    display: block;
    width: 100%;
    font-size: 1.3rem;
    font-weight: 600;
    color: #00a365;
    }

    .product-card-title{
    font-size: 0.7rem;
    
    overflow: hidden;
    margin-bottom: 10px;
    color: #7d7d7d;
    font-weight: 500;
    }

    .product-brand{
    font-weight: bold !important;
    }

    @media only screen and (max-width: 600px) {
  .slider-container, .our-picks{
   max-width: 500px;
  }
}
`

$("<style>").addClass("carousel-style").html(css).appendTo("head");
}

  init();
})();
