const url = '../pdf.pdf'

let pdfDoc = null,
    pageNum = 1,
    PageIsRendering = false,
    PageNumIsPending = null;

const scale = 1.2,
      canvas = document.querySelector("#pdf-render"),
      ctx = canvas.getContext('2d');


function RenderPage(num){
    PageIsRendering = true

    

    pdfDoc.getPage(num).then((page)=>{
        const viewport = page.getViewport({scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx ={
            canvasContext:ctx,
            viewport
        }

        page.render(renderCtx).promise.then(()=>{
            PageIsRendering = false;
     

        if(PageNumIsPending !== null){
            RenderPage(PageNumIsPending);
            PageNumIsPending = null
        }
       })
       document.querySelector('#page-num').textContent = num
    })

}     

function queRenderPage (num){
    if(PageIsRendering){
        PageNumIsPending = num
    }else{
        RenderPage(num)
    }
}


function showPrevPage(){
    if(pageNum <= 1){
        return
    }
    pageNum--
    queRenderPage(pageNum)
}


function showNextPage(){
    if(pageNum >= pdfDoc.numPages){
        return
    }
    pageNum++
    queRenderPage(pageNum)
}

pdfjsLib.getDocument(url).promise.then((pdfDoc_)=>{
pdfDoc = pdfDoc_


document.querySelector('#page-count').textContent = pdfDoc.numPages


RenderPage(pageNum)
})
.catch((err)=>{
const div = document.createElement('div')
div.className = 'error'
div.appendChild(document.createTextNode(err.message))
document.querySelector('body').insertBefore(div,canvas)

document.querySelector('.top-bar').style.display ="none"
})


document.querySelector('#prev-page').addEventListener('click',showPrevPage)
document.querySelector('#next-page').addEventListener('click',showNextPage)
