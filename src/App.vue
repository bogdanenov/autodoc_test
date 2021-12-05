<template>
  <div id="nav">
    <router-link to="/">Table</router-link>
    <router-link to="/charts">Charts</router-link>
  </div>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #495057;
}

#nav {
	display: flex;
	justify-content: flex-end;
	background-color: #293042;
	padding: 15px;
}

#nav a {
  font-weight: bold;
  color: #adb5bd;
	text-decoration: none;
	margin-right: 25px;
	transition: color .3s ease;
}

#nav a:hover {
	color: #fff;
}

#nav a.router-link-exact-active {
  color: #568fed;
}
</style>
