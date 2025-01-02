Page({
    data: {
      code: -1,  // 用于标识是否成功获取数据
      todayWeather: {},
      previousDays: [],  // 初始化前三天数据
      city: '成都'  // 默认城市为成都
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
      const dates = [
        this.formatDate(today),
        this.formatDate(new Date(today.setDate(today.getDate() - 1))),
        this.formatDate(new Date(today.setDate(today.getDate() - 1))),
        this.formatDate(new Date(today.setDate(today.getDate() - 1)))
      ];
  
      const weatherData = [];
      let requestsRemaining = dates.length;
  
      dates.forEach(date => {
        wx.request({
          url: `http://localhost:8080/api/weather?city=${encodeURIComponent(city)}&date=${date}`,
          method: 'GET',
          success(res) {
            console.log(`Weather API response for ${date}:`, res.data);
            if (res.data) {
              weatherData.push({
                date: res.data.date,
                low: res.data.temperature ? res.data.temperature.split('~')[0] : '',
                high: res.data.temperature ? res.data.temperature.split('~')[1] : '',
                weather: res.data.humidity,
                city: res.data.city,
                wind: res.data.wind
              });
            }
            requestsRemaining -= 1;
            if (requestsRemaining === 0) {
              const [todayWeather, ...previousDays] = weatherData;
  
              that.setData({
                code: 0,
                todayWeather: todayWeather,
                previousDays: previousDays,
                city: city
              });
            }
          },
          fail() {
            wx.showToast({
              title: `请求 ${date} 天气数据失败，请检查网络连接`,
              icon: 'none'
            });
            requestsRemaining -= 1;
            if (requestsRemaining === 0) {
              const [todayWeather, ...previousDays] = weatherData;
  
              that.setData({
                code: 0,
                todayWeather: todayWeather,
                previousDays: previousDays,
                city: city
              });
            }
          }
        });
      });
    },
  
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  });
  