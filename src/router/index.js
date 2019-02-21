import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import login from '@/components/login'
import packageInfo from '@/components/packageInfo'
import role from '@/components/role'
import addRole from '@/components/addRole'
import vipInfo from '@/components/vipInfo'
import addVip from '@/components/addVip'
import doctInfo from '@/components/doctInfo' 
import editDoct from '@/components/editDoct' 
import nurseInfo from '@/components/nurseInfo'
import checkNurse from '@/components/checkNurse'
import checkPac from '@/components/checkPac'
import item from '@/components/item'
import checkItem from '@/components/checkItem'
import specimen from '@/components/specimen'
import checkSpecimen from '@/components/checkSpecimen'
import categoryType from '@/components/categoryType'
import checkCatType from '@/components/checkCatType'
import report from '@/components/report'
import checkReport from '@/components/checkReport'
import listOrder from '@/components/listOrder'
import checkOrder from '@/components/checkOrder'
import userCheck from '@/components/userCheck'
import editUserCheck from '@/components/editUserCheck'
import statistics from '@/components/statistics'
import statisticsCity from '@/components/statisticsCity'
import statisticsMonth from '@/components/statisticsMonth'
import statisticsOfCatg from '@/components/statisticsOfCatg'
import statisticsOfService from '@/components/statisticsOfService'
import statisticsOfCatgofMonth from '@/components/statisticsOfCatgofMonth'
import statisticsOfServiceOfMonth from '@/components/statisticsOfServiceOfMonth'
import userInfo from '@/components/userInfo'
import checkUser from '@/components/checkUser'
import readPrice from '@/components/readPrice'
import checkReadRepo from '@/components/checkReadRepo'
import fansRules from '@/components/fansRules'
import checkfans from '@/components/checkfans'
import shanChaType from '@/components/shanChaType'
import checkGoodType from '@/components/checkGoodType'
import checkStation from '@/components/checkStation'
import uploadReport from '@/components/uploadReport'
import doctorAccount from '@/components/doctorAccount'
import serviceStationAccount from '@/components/serviceStationAccount'
import receiveSample from '@/components/receiveSample'
import packageCard from '@/components/packageCard'
import checkcard from '@/components/checkcard'
import integralRule from '@/components/integralRule'
import checkIntegral from '@/components/checkIntegral'
import timeRule from '@/components/timeRule'
import checktimeRule from '@/components/checktimeRule'
import selectDoctorAcountByMonth from '@/components/selectDoctorAcountByMonth'
import nurseAccount from '@/components/nurseAccount'
import stationAccount from '@/components/stationAccount'
import nurseAccountDetail from '@/components/nurseAccountDetail'
import stationAccountDetail from '@/components/stationAccountDetail'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: "/login" },
    { path: "/login", component: login },
    {
      path: "/main",redirect: "/main/1-1", component: main,
      children: [
        { path: '/main/1-1', component: packageInfo },
        { path: '/main/1-1/checkPac',  component: checkPac },
        { path: '/main/1-2',  component: item   },
        { path: '/main/1-2/checkItem',  component: checkItem  },
        { path: '/main/1-3',  component: specimen   },
        { path: '/main/1-3/checkSpecimen',  component: checkSpecimen   },
        { path: '/main/1-4',  component: categoryType   },
        { path: '/main/1-4/checkCatType',  component: checkCatType   },
        { path: '/main/3-1',component: vipInfo },
        { path: '/main/3-1/addVip',  component: addVip  },
        { path: '/main/3-2-1',  component: doctInfo },
        { path: '/main/3-2-1/editDoct', component: editDoct},
        { path: '/main/3-2-2',  component: shanChaType },
        { path: '/main/3-2-2/checkGoodType',  component: checkGoodType },

        { path: '/main/3-3',  component: nurseInfo },
        { path: '/main/3-3/checkNurse',  component: checkNurse  },
        { path: '/main/4-1',  component: report  },
        { path: '/main/4-1/checkReport',  component: checkReport  },
        { path: '/main/5-1',  component: listOrder  },
        { path: '/main/5-1/checkOrder',  component: checkOrder  },
        { path: '/main/6-1',  component: userCheck  },
        { path: '/main/6-1/editUserCheck',  component: editUserCheck  },

        { path: '/main/7-1',  component: checkStation },
        { path: '/main/7-1/uploadReport',  component: uploadReport },
        { path: '/main/7-1/receiveSample',  component: receiveSample },

        { path: '/main/8-1',  component: statistics  },
        { path: '/main/8-1/statisticsCity',  component: statisticsCity  },
        { path: '/main/8-1/statisticsCity/statisticsMonth',  component: statisticsMonth  },
        { path: '/main/8-1/statisticsCity/statisticsOfCatg',  component: statisticsOfCatg  },
        { path: '/main/8-1/statisticsCity/statisticsOfService',  component: statisticsOfService  },
        { path: '/main/8-1/statisticsCity/statisticsMonth/statisticsOfCatgofMonth',  component: statisticsOfCatgofMonth  },
        { path: '/main/8-1/statisticsCity/statisticsMonth/statisticsOfServiceOfMonth',  component: statisticsOfServiceOfMonth  },
        
        { path: '/main/9-1', component: role },
        { path: '/main/9-1/addRole', component: addRole },
        { path: '/main/9-2', component: userInfo },
        { path: '/main/9-2/checkUser', component: checkUser },
        { path: '/main/9-3', component: readPrice },
        { path: '/main/9-3/checkReadRepo', component: checkReadRepo },
        { path: '/main/9-4', component: fansRules },
        { path: '/main/9-4/checkfans', component: checkfans },
        { path: '/main/9-5', component: integralRule },
        { path: '/main/9-5/checkIntegral', component: checkIntegral },
        { path: '/main/9-6', component: timeRule },
        { path: '/main/9-6/checktimeRule', component: checktimeRule },
        
        { path: '/main/10-1',  component: doctorAccount },
        { path: '/main/10-1/selectDoctorAcountByMonth',  component: selectDoctorAcountByMonth },

        { path: '/main/10-2',  component: nurseAccount },
        { path: '/main/10-2/nurseAccountDetail',  component: nurseAccountDetail },

        { path: '/main/10-3',  component: stationAccount },
        { path: '/main/10-3/stationAccountDetail',  component: stationAccountDetail },

        
        { path: '/main/10-3',  component: serviceStationAccount },
        { path: '/main/11-1',  component: packageCard },
        { path: '/main/11-1/checkcard',  component: checkcard },
        
      ]
    },
  ]
})
