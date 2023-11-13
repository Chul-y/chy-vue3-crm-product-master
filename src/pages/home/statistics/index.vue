<template>
  <div>
    <h1>数据</h1>
    <div ref="chartRef" class="contaioner"  style=" width: 600px; height: 300px"></div>
    <div id="echarts-container" style="width: 600px; height: 400px;"></div>
  </div>
</template>
<script setup>
// 导入
import * as echarts from 'echarts';

import * as api from "@/api/echarts"

// 引入适配库
import flexible from "@/utils/flexible"

// 3、需要一个dom容器，一定要设置高度
let chartRef = ref(null)

let myChart = null

//  手淘适配的方法
flexible(()=>{
    if(myChart){
        myChart.resize()
    }
})

// 4、 基于准备好的dom,初始化echarts实例
onMounted( async()=>{
    // 确保被挂载
     myChart = echarts.init(chartRef.value)

    // 等待动画
    myChart.showLoading()
    // 通过异步请求获取数据
    let res =await api.expectApi()
    // 得到数据后关闭动画
    myChart.hideLoading()
        // 处理数据
        // ---series
        let data = []
        // ----类目
        let categoryData = res.data.map(item=>{
            data.push(item.rate);
            return item.name
        })

        // 获取完数据，动态的传给图表格，调用setOption,把data,categoryData传递过去

    myChart.setOption({
        title: {
          text: 'ECharts 入门示例',
         
        },
        tooltip: {
            axisPointer:{
                type:"line"
            },
           
        },
        legend: {
          
        },
        // 类目，对应的是获取的数据的data的title
        xAxis: {
          data: categoryData,
          show:false
        },
        yAxis: {
            show:false
        },
        // 对应的是获取的数据的data的rate
        series: [
        {
            name: '销量',
            type: 'line',
            data,
            label:{
                show:true,
                formatter:"{b}:{c}%",
                color:"#0da2c8",
                fontSize:"30px"
            }
        },
      ]
    });
    // 5、在窗口大小发生变化是，调用resize方法直接适配，确保dom已经挂载,且大小发生变化时
    window.onresize = ()=>{
    console.log(1)
    myChart.resize()
    }

})


</script>

<script>
    export default {
    //自己定义的属性
    meta: {
        key: "数据统计",
        icon:"icon-tongji"
    }

}
</script>


<style scoped>
    .contaioner{
        width: 1300px;
        border: 1px solid #ccc
    }


    #echarts-container{
        position: absolute;
        top: 700px;
        left: 700px;

    }
</style>
<!-- 
    柱状改折线 type
    想要xy轴都要显示
        配置--setOption--xAxis\YAxis--show:true
    折线图就节点是尖锐还是圆滑 --setOption--series--smooth:true
    节点上面显示文字：
        找素材，看别人怎么写的)
        每个节点都显示：series--label.show
    主要是需要自定义的地方，都用forMatter
        字符串模板变量{a}系列名,{b}数据名,{c}数据值
        也在series--label.show里面写，因为要自定义她的值

    以上都要先知道外层属性，再往里找


    异步请求也可以有动画，在加载比较缓慢时候，有个加载动画
        调用：echarts的showLoading方法
-->



<!-- 
    适配方案
        见day24 需要负值flexible.js 文件到utils,再导入这里面，
 -->
 <!-- 
    窗口适配
    libflexible的作用是根据窗口大小变化，然后动态修改浏览器的根字体大小
    Postcss-plug-px2rem这个插件的作用是将编写的css的px自动换为rem，但是不能转换行内样式

    图表适配
    调用eacharts方法(resize)
        当窗口大小改变时候，调用
 -->


 <!-- 
    使用vw的同时把引入去掉也是可以的，但是用px就要引入，并且flexable改造
  -->