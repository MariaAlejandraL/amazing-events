// https://amazing-events.herokuapp.com/api/events
// methods: los metodos son las funciones dentro de los objetos/clases

const { createApp } = Vue

createApp({
  data() {
    return {
      completeData: [], 
      dataDate: "",
      names: "",
      filteredEvents: [],
      catagoryEvents: [],
      checkboxSelected: [],
      pastData: [],
      upcomingData: [],
      detailArray : [],
      prueba: [],
      highAttendance:[],
      largerCapacity:[],
      lowAttendance: [],
      upcomingStatistics:[],
      pastStatistics: []
    }
  },
  created() {
    fetch('https://amazing-events.herokuapp.com/api/events')
    .then(response => response.json())
    .then(data => {
      this.completeData = data.events 
      this.dataDate = data.currentDate
      this.pastData = this.completeData.filter(e => e.date < this.dataDate)
      this.upcomingData = this.completeData.filter(e => e.date >= this.dataDate)
      this.filteredEvents = this.completeData
      this.getCategories() 
    

      if(document.title == "Past Events"){
        this.completeData = this.pastData
      }
      if(document.title == "Upcoming Events"){
        this.completeData = this.upcomingData
      } 
      if (document.title == "Details"){
        this.detailCard()
      }
      if (document.title == "Stats"){
        this.firstRowTable(this.pastData)
        this.upcomingTable(this.upcomingData)
        this.pastTable(this.pastData) 
      }
    })
    
  },
  methods: {

    filterByName(){
      this.filteredEvents = this.completeData.filter(event => event.name.toLowerCase().includes(this.names.toLowerCase())); // acá si encuentra algo en lo que coincida, el array original de names y el input del search, lo guarda en la variable filtrada // todos los eventos que coincidan se guardan en el array
    },
    getCategories(){
      this.catagoryEvents = this.filteredEvents.map(c => c.category)
      this.catagoryEvents = new Set(this.catagoryEvents) // new set, es un metodo que contiene los valores generales, sin repetirlo 
    },
    detailCard(){
      let idHTML = location.search.split("?id=").join("");
      let detailFilter = this.completeData.filter(e => e._id == idHTML)[0]
      this.detailArray = detailFilter
    },
    firstRowTable(pastData){
      let events = [];
      for (let i = 0; i < pastData.length; i++) {
          let percentage = (pastData[i].assistance*100)/(pastData[i].capacity)

          var event = new Object();
          event.name = pastData[i].name
          event.assistance = percentage
          event.capacity = pastData[i].capacity
          events.push(event) 
      }
      events.sort((a,b) => b.assistance - a.assistance)
      this.highAttendance = events[0];

      events.sort((a,b) => b.capacity - a.capacity)
      this.largerCapacity = events[0];
     

      events.sort((a,b) => a.assistance - b.assistance)
      this.lowAttendance = events[0]
    },
    upcomingTable(upcomingData) {
      var categorias = upcomingData.map(function(x) {
          return x.category;
      });
  
      let result = categorias.filter((item,index)=>{
          return categorias.indexOf(item) === index;
      })
      let contenedor = []
      for (let i = 0; i < result.length; i++) {
         let acum = 0
          let cont = 0
          let sumaIngresos = 0
          for (let j = 0; j < upcomingData.length; j++) {
              if (result[i] == upcomingData[j].category){
                  sumaIngresos += upcomingData[j].price * upcomingData[j].estimate
                  let asistencia = (upcomingData[j].estimate * 100)/(upcomingData[j].capacity)
                  acum += asistencia
                  cont = cont + 1 
              }
          }
          let promedio = acum/cont
          let eventFilter = new Object();
          eventFilter.name = result[i]
          eventFilter.ingresos = sumaIngresos
          eventFilter.estimate = promedio 
          contenedor.push(eventFilter)
      }

      this.upcomingStatistics = contenedor
  
  
      
      
      
    },
    pastTable(pastEventsData) {
      var categorias = pastEventsData.map(function(x) {
          return x.category;
      });
  
      let result = categorias.filter((item,index)=>{
          return categorias.indexOf(item) === index;
      })
  
  
      let contenedor = []
      let cuerpoTabla = document.getElementById('pastStats')
      
      for (let i = 0; i < result.length; i++) {
       let   acum = 0
       let   cont = 0
       let    sumaIngresos = 0
         
          for (let j = 0; j < pastEventsData.length; j++) {
              if (result[i] == pastEventsData[j].category){
                  sumaIngresos += pastEventsData[j].price * pastEventsData[j].assistance
                  let asistencia = (pastEventsData[j].assistance * 100)/(pastEventsData[j].capacity)
                  acum += asistencia
                  cont = cont + 1 
              }
          }
          let promedio = acum/cont
          let eventFilter = new Object();
          eventFilter.name = result[i]
          eventFilter.ingresos = sumaIngresos
          eventFilter.estimate = promedio 
          contenedor.push(eventFilter)
      }

      this.pastStatistics = contenedor
  
  
      
  }

  },
  computed: {

    searcher (){
      if(this.checkboxSelected.length != 0){
        this.filteredEvents = this.completeData.filter(c => {
          return this.checkboxSelected.includes(c.category)})

      } else {
        this.filteredEvents = this.completeData

      }
      if(this.names != ''){
        this.filterByName(this.filteredEvents)
      }
    }
  }
}).mount('#app')




