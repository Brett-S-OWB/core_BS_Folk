import{D as a}from"./HardwareInstallation-76795b33.js";import{_ as d,u as t,k as l,l as u,G as i,E as m,y as _}from"./vendor-88a3d381.js";import"./vendor-fortawesome-2ab93053.js";import"./index-9eb4725b.js";import"./vendor-bootstrap-6598ffd1.js";import"./vendor-jquery-536f4487.js";import"./vendor-axios-29ac7e52.js";import"./vendor-sortablejs-f1eda7cf.js";import"./dynamic-import-helper-be004503.js";const b={name:"DeviceOpenwbFlex",mixins:[a]},c={class:"device-openwb-flex"};function f(o,e,v,w,g,x){const p=t("openwb-base-heading"),s=t("openwb-base-text-input"),r=t("openwb-base-number-input");return l(),u("div",c,[i(p,null,{default:m(()=>e[2]||(e[2]=[_(" Einstellungen für openWB-Flex ")])),_:1}),i(s,{title:"IP oder Hostname",subtype:"host",required:"","model-value":o.device.configuration.ip_address,"onUpdate:modelValue":e[0]||(e[0]=n=>o.updateConfiguration(n,"configuration.ip_address"))},null,8,["model-value"]),i(r,{title:"Port",required:"",min:1,max:65535,"model-value":o.device.configuration.port,"onUpdate:modelValue":e[1]||(e[1]=n=>o.updateConfiguration(n,"configuration.port"))},null,8,["model-value"])])}const F=d(b,[["render",f],["__file","/opt/openWB-dev/openwb-ui-settings/src/components/devices/openwb/openwb_flex/device.vue"]]);export{F as default};