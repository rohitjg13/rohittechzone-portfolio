// Mobile burger menu
function openNav() {
    document.getElementById("myNav").style.width = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

// Home screen background
particlesJS.load('particles-js', 'assets/particlesjs-config.json', function() {
    console.log('callback - particles.js config loaded');
});

// About me Page (Counter)
new PureCounter();

// About me Page (Blob)
if(window.innerWidth > 1080){
    const renderer_img = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer_img.setPixelRatio(window.devicePixelRatio);
    renderer_img.setSize(window.innerWidth/4, window.innerHeight/4);
    renderer_img.setClearColor(0x141414, 0.0);
    document.getElementById('canvas-about').appendChild(renderer_img.domElement);
    const scene_img = new THREE.Scene();
    let camera_img = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera_img.position.z = 5;
    const sphere_geometry = new THREE.SphereGeometry(1, 128, 128);
    const material_img = new THREE.MeshNormalMaterial();
    let sphere_img = new THREE.Mesh(sphere_geometry, material_img);
    scene_img.add(sphere_img);
    const update_img = function () {
        const time = performance.now() * 0.003;
        const k = 3;
        for (let i = 0; i < sphere_img.geometry.vertices.length; i++) {
            let p = sphere_img.geometry.vertices[i];
            p.normalize().multiplyScalar(1 + 0.3 * noise.perlin3(p.x * k + time, p.y * k, p.z * k));
        }
        sphere_img.geometry.computeVertexNormals();
        sphere_img.geometry.normalsNeedUpdate = true;
        sphere_img.geometry.verticesNeedUpdate = true;
    }
    function animate_img() {
        update_img();
        renderer_img.render(scene_img, camera_img);
        requestAnimationFrame(animate_img);
    }
    requestAnimationFrame(animate_img);
}

// Journey page roadmap
(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };
    throttle("resize", "optimizedResize");
    })();

    var roadmap = (function() {
    var wrapper = document.querySelector('.js-roadmap-timeline');
    var timeframes = document.querySelectorAll('.js-roadmap-timeframe');
    var mediaQuery = window.matchMedia("(min-width: 1201px)");
    var topMaxHeight;
    var bottomMaxHeight;

    handleStyling();
    window.addEventListener("optimizedResize", handleStyling);

    function handleStyling() {
        if (mediaQuery.matches) {
        applyHeights();
        styleWrapper();
        } else {
        clearWrapperStyling();
        }
    }
    
    function applyHeights() {
        topMaxHeight = getMaxHeight(timeframes, 0);
        bottomMaxHeight = getMaxHeight(timeframes, 1);
    }
    
    function getMaxHeight(els, start) {
        var maxHeight = 0;
        var i = start;
        
        for (; i < els.length - 1; i = i + 2) {
        var elHeight = els[i].offsetHeight;
        maxHeight = maxHeight > elHeight ? maxHeight : elHeight;
        }
        
        return maxHeight;
    }
    
    function styleWrapper() {
        wrapper.style.paddingBottom = bottomMaxHeight + 'px';
        wrapper.style.paddingTop = topMaxHeight + 'px';
    }
    
    function clearWrapperStyling() {
        wrapper.style.paddingBottom = '';
        wrapper.style.paddingTop = '';
    }
})();

// skills page animate on scroll
var els = document.getElementsByClassName("progress");
const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
    const square = entry.target.querySelector('.progress');

    if (entry.isIntersecting) {
        for(var i = 0; i < els.length; i++)
        {
            var el = els[i];
            var persentage = el.getAttribute("data-persentage");
            el.style.display = 'block';
            el.style.setProperty("--persentage", persentage + "%");
            el.style.width = persentage + "%";
            el.style.animation = 'progress-bar 2s'
        }
        return;
    }

    for(var i = 0; i < els.length; i++)
    {
        var el = els[i];
        el.style.display = 'none';
    }
});
});

observer.observe(document.querySelector('.skills'));

// project and acc page tab navigator
function openTab(evt, locName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(locName).style.display = "flex";
    evt.currentTarget.className += " active";
}

// project and acc page slide content
// <______________________Projects_______________________>
var pro_content = [
    {
        title: "Mask Detector",
        description: "Online webapp which opens your camera and uses Image detection to check whether you wear a mask.",
        img: "https://ik.imagekit.io/ts8k4euqi/mask_T36H8czPp.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1652928427314",
        link: "https://rohittechzone.github.io/AI-Mask-Detector/"
    },
    {
        title: "GPT-3 Chatbot",
        description: "GPT-3 is the smartest Artificial Intelligence ever existed, this discord chat bot uses gpt3 to reply to human messages.",
        img: "https://ik.imagekit.io/ts8k4euqi/gpt3_uzKt5dYAN.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1652928427117",
        link: ""
    },
    {
        title: "Responsive Website",
        description: "Website which adapts automatically to the screen size either it is mobile or table or pc, just like this one!",
        img: "https://ik.imagekit.io/ts8k4euqi/website_kcmuH4Yvs.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1652928427091",
        link: "https://heuristic-murdock-04d3ed.netlify.app/"
    },
];
var elements_all_list_pro = []
for(var i = 0; i < pro_content.length; i++){
    var element_content_temp_pro = `
    <div class="pro__content swiper-slide">
        <div class="pro__data">
            <div class="pro__header">
                <a onclick="return false;" style="pointer-events: none;" href="${pro_content[i].link}" class="pro_img_link">
                    <img class="pro__img" src="${pro_content[i].img}" alt=""/>
                    <!-- link -->
                </a>

                <div class="text_pro_slide">
                    <h3 class="pro__name">${pro_content[i].title}</h3>
                    <span class="pro__client">${pro_content[i].description}</span>
                </div>
            </div>
        </div>
    </div>`;
    if(pro_content[i].link != ""){
        element_content_temp_pro = element_content_temp_pro.replace("<!-- link -->", `<h6 href="${pro_content[i].link}" class="demo_pro">(Click the image to for demo)</h6>`);
        element_content_temp_pro = element_content_temp_pro.replace("onclick=\"return false;\" style=\"pointer-events: none;\"", "");
    }
    elements_all_list_pro.push(element_content_temp_pro);
}
var elements_all_pro = elements_all_list_pro.join("");
document.getElementById("pro_slider_wrapper").innerHTML += elements_all_pro

// <______________________Accomplishment_______________________>
var acc_content = [
    {
        title: "CBSE National Level",
        subtext: "1st Prize, New Delhi",
        img: "https://ik.imagekit.io/ts8k4euqi/cbse_m6ohozX9T.png?ik-sdk-version=javascript-1.4.3&updatedAt=1652927081944",
        description: "This is a science competition held by CBSE, I was selected for the 1st prize in the competition in the whole country."
    },
    {
        title: "Puthiyathalaimurai State Level",
        subtext: "2nd Prize, Tamil Nadu",
        img: "https://ik.imagekit.io/ts8k4euqi/put_Nh-f3mQuI.png?ik-sdk-version=javascript-1.4.3&updatedAt=1652927082255",
        description: "This is a science competition conducted by Puthiyathalaimurai as state level and i got 2nd prize state wide."
    },
    {
        title: "IEEE International Level",
        subtext: "Demo, Thailand",
        img: "https://ik.imagekit.io/ts8k4euqi/IEEE__P8tH29Pw.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1652927081911",
        description: "This is a international level science showcase session conducted at Thailand, I was selected for it by a regional selection."
    },
];
var elements_all_list = []
for(var i = 0; i < acc_content.length; i++){
    var element_content_temp = `
    <div class="acc__content swiper-slide">
        <div class="acc__data">
            <div class="acc__header">
                <img class="acc__img" src="${acc_content[i].img}" alt="">
                <div>
                    <h3 class="acc__name">${acc_content[i].title}</h3>
                    <span class="acc__client">${acc_content[i].subtext}</span>
                </div>
            </div>

            <div>
                <i class="uil uil-trophy acc__icon-star"></i>
                
            </div>
        </div>

        <p class="acc__description">${acc_content[i].description}</p>
        </p>
    </div>`;
    elements_all_list.push(element_content_temp);
}
var elements_all = elements_all_list.join("");
document.getElementById("acc_slider_wrapper").innerHTML += elements_all

// project and acc page swiper
let swiperAcc = new Swiper(".acc__container", {
    loop:true,
    grabCursor: true,
    spaceBetween: 48,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
    pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
    },
    breakpoints: {
        770:{
            slidesPerView: 2,
        },
        568:{
            slidesPerView: 1,
        },
        1000:{
            slidesPerView: 2.25,
        }
    }
});
let swiperPro = new Swiper(".pro__container", {
    loop:true,
    grabCursor: true,
    spaceBetween: 48,
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
    pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
    },
    breakpoints: {
        775:{
            slidesPerView: 1.25,
        },
        1200:{
            slidesPerView: 2.25,
        }
    }
});

// Contact me background(vantajs)
VANTA.WAVES({
    el: ".contact_me",
    mouseControls: false,
    touchControls: false,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x0b1017
    //background: #0b1017;
})

