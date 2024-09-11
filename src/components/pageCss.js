import { ref } from 'vue';


export function usePageCss(){

    const setupPageCss = function(configs){
        console.log('setupPageCss-', configs);
        debugger;
        var gridRows = configs.height;
        var gridColumns = configs.width;
        var cellGapAmt=3;
        var cellGap = cellGapAmt+'px';
        let gapTotal = Number(gridColumns*cellGapAmt)+cellGapAmt;
        var cellHeight;
        /*
        if(typeof(configs.rowHeight)!='undefined'){
            cellHeight = Number(configs.rowHeight);
        }else {
            cellHeight = Math.round(configs.pageDimensions.contentHeight / gridRows);
        }
         */
        cellHeight = 60;
        let cellWidth = Math.round((configs.pageDimensions.contentWidth-gapTotal)/gridColumns);
        var gridParameters = layoutGridParameters(gridRows, gridColumns, cellHeight, cellWidth);
        var gridCss;
        if(configs.backgroundType=='C'){
            gridCss = 'display:grid; '+'grid-gap:'+ cellGap+'; background-color: '+configs.backgroundColor+'; ';
            gridCss = gridCss + gridParameters.rowGrid+';'+gridParameters.columnGrid+';';
        }else{
            gridCss = backgroundImageCss(configs.backgroundImageUrl,
                configs.pageDimensions.contentWidth,
                configs.pageDimensions.contentHeight,
                gridParameters.rowGrid,
                gridParameters.columnGrid,
                configs.backgroundDisplay);
        }
        console.log('current gridCss is-', gridCss);
        return gridCss;
    }

    const layoutGridParameters = function(height, width, cellHeight, cellWidth) {
//      debugger;
        var gridHeightCss="grid-template-rows: "
        var gridWidthCss="grid-template-columns: ";
        for (var x = 0; x < height; x++) {
            gridHeightCss = gridHeightCss+cellHeight + "px ";
        }
        for (x = 0; x < width; x++) {
            gridWidthCss = gridWidthCss + cellWidth + "px ";
        }
        var gridCssObject = {};
        gridCssObject.rowGrid = gridHeightCss;
        gridCssObject.columnGrid = gridWidthCss;
        return gridCssObject;

    }

    const backgroundImageCss= function(backgroundUrl, widthBackground, heightBackground, gridHeightCss, gridWidthCss, backgroundDisplay){
        debugger;
        switch(backgroundDisplay){
            case 'crop':{
                var gridCss =
                    "display: grid; grid-gap: 3px; background-image: url("+backgroundUrl+"); background-size:crop; background-repeat: no-repeat; background-position: center; height: 90vh; color: #ffcd90; " +
                    gridHeightCss +
                    ";" +
                    gridWidthCss +
                    ";";
                return gridCss
            }
            case 'contain':{
                gridCss =
                    "display: grid; grid-gap: 3px; background-image: url("+backgroundUrl+"); background-size:contain; background-repeat: no-repeat; background-position: center; height: 90vh; color: #ffcd90; " +
                    gridHeightCss +
                    ";" +
                    gridWidthCss +
                    ";";
                return gridCss
            }
            case 'stretch':{
                gridCss =
                    "display: grid; grid-gap: 3px; background-image: url("+backgroundUrl+"); background-size:"+widthBackground+heightBackground+"; background-repeat:no-repeat; background-position: center; height: 90vh; color: #ffcd90; " +
                    gridHeightCss +
                    ";" +
                    gridWidthCss +
                    ";";
                return gridCss
            }
            case 'repeat':{
                gridCss =
                    "display: grid; grid-gap: 3px; background-image: url("+backgroundUrl+"); background-size:contain; background-repeat:repeat; background-position: center; height: 90vh; color: #ffcd90; " +
                    gridHeightCss +
                    ";" +
                    gridWidthCss +
                    ";";
                return gridCss
            }

            default:{
                gridCss =
                    "display: grid; grid-gap: 3px; background-image: url("+backgroundUrl+"); background-size:cover; background-repeat: no-repeat; background-position: center; height: 90vh; color: #ffcd90; " +
                    gridHeightCss +
                    ";" +
                    gridWidthCss +
                    ";";
                return gridCss
            }
        }

    }


    const computeGridCss = function(row, col, height, width){
//        debugger;
        var startRow = row;
        var startColumn = col;
        var endRow=0;
        var endCol=0;
        if(height==1){
            endRow = row;
        }else{
            endRow = height+1;
        }
        if(width==1){
            endCol=startColumn+width;
        }else{
            endCol = width+1;
        }
        var thisCss = "grid-area:"+startRow+"/"+startColumn+"/"+endRow+"/"+endCol;
        return thisCss;

    }



    return {setupPageCss, computeGridCss}


}
