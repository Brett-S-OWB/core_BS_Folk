import{C as h}from"./index-f9fda857.js";import{_ as b,u as o,k as i,l as u,x as l,D as s,N as a,y as r}from"./vendor-a21b3a62.js";import"./vendor-fortawesome-41164876.js";import"./vendor-bootstrap-d0c3645c.js";import"./vendor-jquery-a5dbbab1.js";import"./vendor-axios-0e6de98a.js";import"./vendor-sortablejs-3016fed8.js";const _={name:"OpenwbScheduledChargeConfigView",mixins:[h],emits:["save","reset","defaults"],data(){return{mqttTopicsToSubscribe:["openWB/general/extern","openWB/general/chargemode_config/scheduled_charging/phases_to_use","openWB/general/chargemode_config/scheduled_charging/phases_to_use_pv"]}}},c={class:"scheduledChargeConfig"},f={name:"scheduledChargeConfigForm"},v={key:0},w={key:1};function k(t,e,C,V,B,$){const g=o("openwb-base-alert"),d=o("openwb-base-button-group-input"),m=o("openwb-base-card"),p=o("openwb-base-submit-buttons");return i(),u("div",c,[l("form",f,[s(m,{title:"Phasenumschaltung"},{default:a(()=>[t.$store.state.mqtt["openWB/general/extern"]===!0?(i(),u("div",v,[s(g,{subtype:"info"},{default:a(()=>e[5]||(e[5]=[r(' Diese Einstellungen sind nicht verfügbar, solange sich diese openWB im Steuerungsmodus "secondary" befindet. ')])),_:1})])):(i(),u("div",w,[s(d,{title:"Anzahl Phasen Zielladen",buttons:[{buttonValue:1,text:"1"},{buttonValue:3,text:"Maximum"},{buttonValue:0,text:"Automatik"}],"model-value":t.$store.state.mqtt["openWB/general/chargemode_config/scheduled_charging/phases_to_use"],"onUpdate:modelValue":e[0]||(e[0]=n=>t.updateState("openWB/general/chargemode_config/scheduled_charging/phases_to_use",n))},{help:a(()=>e[6]||(e[6]=[r(' Hier kann eingestellt werden, ob Ladevorgänge im Modus "Zielladen" mit nur einer Phase oder dem möglichen Maximum in Abhängigkeit der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Im Modus "Automatik" entscheidet die Regelung, welche Einstellung genutzt wird, um das Ziel zu erreichen. Voraussetzung ist die verbaute Umschaltmöglichkeit zwischen 1- und 3-phasig (s.g. 1p3p). ')])),_:1},8,["model-value"]),e[8]||(e[8]=l("hr",null,null,-1)),s(d,{title:"Anzahl Phasen bei PV-Überschuss",buttons:[{buttonValue:1,text:"1"},{buttonValue:3,text:"Maximum"},{buttonValue:0,text:"Automatik"}],"model-value":t.$store.state.mqtt["openWB/general/chargemode_config/scheduled_charging/phases_to_use_pv"],"onUpdate:modelValue":e[1]||(e[1]=n=>t.updateState("openWB/general/chargemode_config/scheduled_charging/phases_to_use_pv",n))},{help:a(()=>e[7]||(e[7]=[r(' Hier kann eingestellt werden, ob Ladevorgänge im Modus "Zielladen" bei Laden mit PV-Überschuss mit nur einer Phase oder dem möglichen Maximum in Abhängigkeit der "Ladepunkt"- und "Fahrzeug"-Einstellungen durchgeführt werden. Im Modus "Automatik" entscheidet die Regelung, welche Einstellung genutzt wird, um das Ziel zu erreichen. Voraussetzung ist die verbaute Umschaltmöglichkeit zwischen 1- und 3-phasig (s.g. 1p3p). ')])),_:1},8,["model-value"])]))]),_:1}),s(p,{"form-name":"scheduledChargeConfigForm",onSave:e[2]||(e[2]=n=>t.$emit("save")),onReset:e[3]||(e[3]=n=>t.$emit("reset")),onDefaults:e[4]||(e[4]=n=>t.$emit("defaults"))})])])}const E=b(_,[["render",k],["__file","/opt/openWB-dev/openwb-ui-settings/src/views/ScheduledChargeConfig.vue"]]);export{E as default};