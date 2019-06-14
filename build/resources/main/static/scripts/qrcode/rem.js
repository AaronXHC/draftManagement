! function (window) {
    'use strict';
    /**
     * 基准宽度,推荐使用设计图宽度（单位px）
     */
    var BASE_WIDTH = 970;
    /**
     * 根元素字体在基准宽度下的大小（单位px）
     */
    var BASE_FONT_SIZE = 100;

    /**
     * 响应的最大宽度（单位px）
     */
    var MAX_WIDTH = 970;

    /**
     * 响应的最小宽度（单位px）
     */
    var MIN_WIDTH = 320;

    /**
     * 最多重试设置字体的次数
     */
    var MAX_RESET_COUNT = 100;

    /**
     * 排除的像素比，此像素比下将字体设置成最多宽度下的字体大小
     */
    var EXCLUDE_PIXEL_RATIO;


    var document = window.document;
    var documentElement = document.documentElement;


    var devicePixelRatio = window.devicePixelRatio || 1;

    /**
     * 设置html元素字体大小
     * @param {Number} targetFontSizes 要设置字体大小
     * @returns {Number} 实际字体大小
     */
    var setFontSize = function (targetFontSize) {
        documentElement.style.fontSize = targetFontSize + 'px';
        return window.getComputedStyle ? parseFloat(window.getComputedStyle(documentElement).fontSize) : targetFontSize; //获得实际字体大小
    }

    /**
     * 根据设备宽度设置根元素字体的方法
     */
    var eventHandler = function () {
        //获得设备宽度
        var width = documentElement.getBoundingClientRect().width || documentElement.clientWidth || BASE_WIDTH;

        if (devicePixelRatio === EXCLUDE_PIXEL_RATIO || width > MAX_WIDTH) {
            //限制最大宽度
            width = MAX_WIDTH;
        } else if (width < MIN_WIDTH) {
            //限制最小宽度
            width = MIN_WIDTH;
        }

        var targetFontSize, realFontSize, delta, tempFontSize;


        targetFontSize = width / BASE_WIDTH * BASE_FONT_SIZE;


        realFontSize = setFontSize(targetFontSize);
        delta = realFontSize - targetFontSize; //计算实际字体大小跟目标字体大小的差
        if (Math.abs(delta) < 1) {
            //如果相差小于1px则返回
            return;
        }

        //尝试等比例地设置字体
        tempFontSize = targetFontSize * targetFontSize / realFontSize;
        delta = setFontSize(tempFontSize) - targetFontSize; //计算实际字体大小跟目标字体大小的差
        if (Math.abs(delta) < 1) {
            //如果相差小于1px则返回
            return;
        }

        tempFontSize = targetFontSize;

        //尝试1像素地调整
        for (var i = 0; i < MAX_RESET_COUNT; i++) {
            if (delta > 1) {
                tempFontSize--;
            } else if (delta < -1) {
                tempFontSize++;
            } else {
                return;
            }
            delta = setFontSize(tempFontSize) - targetFontSize;
        }

    };
    //立即调用方法
    eventHandler();

    //监听事件
    var eventName = 'orientationchange' in window ? 'orientationchange' : 'resize';
    document.addEventListener && window.addEventListener(eventName, eventHandler, false);

    //文档载入完成后调用方法
    if (document.readyState === 'complete') {
        eventHandler();
    } else {
        document.addEventListener && document.addEventListener("DOMContentLoaded", eventHandler, false);
    }
}(window);