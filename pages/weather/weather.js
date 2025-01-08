Page({
    data: {
      code: -1,  // 用于标识是否成功获取数据
      todayWeather: {},
      city: '成都',  // 默认城市为成都
      weatherIcon: ''  // 天气图标路径
    },
  
    onLoad(options) {
      // 页面加载时获取城市和天气数据
      this.fetchWeather(this.data.city);
    },
  
    search(e) {
      const city = e.detail.value.city;  // 获取用户输入的城市
      if (city) {
        this.fetchWeather(city);
      }
    },
  
    fetchWeather(city) {
      const that = this;
      const today = new Date();
      const date = this.formatDate(today);
  
      wx.request({
        url: `http://localhost:8080/api/weather?city=${encodeURIComponent(city)}&date=${date}`,
        method: 'GET',
        success(res) {
          console.log(`Weather API response for ${date}:`, res.data);
          if (res.data) {
            const weatherData = {
              low: res.data.temperature ? res.data.temperature.split('~')[0] : '',
              high: res.data.temperature ? res.data.temperature.split('~')[1] : '',
              weather: res.data.humidity,
              pressure: res.data.pressure,
              win: res.data.win,
              wind: res.data.wind,
              visibility: res.data.visibility
            };
  
            // 根据天气情况设置图标
            const weatherIcon = that.getWeatherIcon(res.data.humidity);
  
            that.setData({
              code: 0,
              todayWeather: weatherData,
              city: city,
              weatherIcon: weatherIcon
            });
          }
        },
        fail() {
          wx.showToast({
            title: `请求天气数据失败，请检查网络连接`,
            icon: 'none'
          });
        }
      });
    },
  
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  
    getWeatherIcon(weather) {
      // 根据天气情况返回对应的图标路径
      switch (weather) {
        case '晴':
          return '../../images/qing.png';
        case '多云':
          return '../../images/duoyun.png';
        case '阴':
          return '../../images/yin.png';
        case '雨':
          return '../../images/yu.png';
        case '雪':
          return '../../images/xue.png';
        case '雾':
          return '../../images/wu.png';
        default:
          return '../../images/qing.png'; // 默认图标
      }
    }
  });