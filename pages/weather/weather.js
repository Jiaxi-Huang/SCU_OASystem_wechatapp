Page({
    data: {
      code: -1,  // 用于标识是否成功获取数据
      todayWeather: {},
      list: [],
      city: ''
    },
  
    onLoad(options) {
      // 页面加载时获取城市和天气数据
      this.getCityAndWeather();
    },
  
    search(e) {
      const city = e.detail.value.city;  // 获取用户输入的城市
      if (city) {
        this.fetchWeather(city);
      }
    },
  
    getCityAndWeather() {
      const that = this;
      wx.request({
        url: "https://restapi.amap.com/v3/ip",
        method: 'GET',
        data: {
          key: "112f7278845a2b4a727d04cffeb63b0b"
        },
        success(res) {
          console.log("Location API response (stringified):", JSON.stringify(res.data));
          const data = res.data;
  
          // 检查 data.city 是否是数组，并获取第一个元素
          let city = Array.isArray(data.city) && data.city.length > 0 ? data.city[0] : '';
          if (typeof city !== 'string' || city === '') {
            city = '成都'; // 设置默认城市为成都
          }
  
          const formattedCity = city.replace('市', '');
          that.setData({ city: formattedCity });
          that.fetchWeather(formattedCity); // 获取城市后调用 fetchWeather 函数
        },
        fail() {
          wx.showToast({
            title: '请求失败，请检查网络连接',
            icon: 'none'
          });
        }
      });
    },
  
    fetchWeather(city) {
      const that = this;
      const today = new Date().toISOString().split('T')[0];
      wx.request({
        url: `http://localhost:8080/api/weather?city=${encodeURIComponent(city)}&date=${today}`,
        method: 'GET',
        success(res) {
          console.log("Weather API response:", res.data);
          if (res.data) {
            const todayWeather = res.data.today || {};
            const list = res.data.list || [];
            that.setData({
              code: 0,
              todayWeather: {
                high: todayWeather.temperature ? todayWeather.temperature.split('~')[1] : '', // 解析高温
                low: todayWeather.temperature ? todayWeather.temperature.split('~')[0] : '', // 解析低温
                airQuality: todayWeather.airQuality || '',
                weather: todayWeather.humidity || '',
                province: todayWeather.province || '',
                city: todayWeather.city || '',
                date: todayWeather.date || '',
                wind: todayWeather.wind || ''
              },
              list: list,
              city: city
            });
          } else {
            wx.showToast({
              title: '获取天气信息失败',
              icon: 'none'
            });
          }
        },
        fail() {
          wx.showToast({
            title: '请求失败，请检查网络连接',
            icon: 'none'
          });
        }
      });
    }
  });
  