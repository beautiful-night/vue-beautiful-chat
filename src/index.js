import LauncherFixed from './LauncherFixed.vue'
import LauncherAbsolute from './LauncherAbsolute.vue'
import VTooltip from 'v-tooltip'

const defaultComponentName = 'BeautifulChat'

const Plugin = {
  install(Vue, options = {}) {
    /**
     * Makes sure that plugin can be installed only once
     */
    if (this.installed) {
      return
    }

    this.installed = true
    this.event = new Vue()
    this.dynamicContainer = null
    this.componentName = options.componentName || defaultComponentName
    /**
     * Plugin API
     */
    Vue.prototype.$chat = {
      _setDynamicContainer(dynamicContainer) {
        Plugin.dynamicContainer = dynamicContainer
      }
    }
    /**
     * Sets custom component name (if provided)
     */
    Vue.component(this.componentName, LauncherFixed)
    Vue.component('SimpleChat', LauncherAbsolute)
    Vue.use(VTooltip)
  }
}

export default Plugin
