#!/usr/bin/env python3
import logging
import re
from typing import Iterable, Optional, List

from helpermodules.cli import run_using_positional_cli_args
from modules.common import req
from modules.common.abstract_device import DeviceDescriptor
from modules.common.component_context import SingleComponentUpdateContext
from modules.common.configurable_device import ConfigurableDevice, ComponentFactoryByType, MultiComponentUpdater
from modules.devices.kostal.kostal_piko_old import inverter
from modules.devices.kostal.kostal_piko_old.config import (KostalPikoOld,
                                                           KostalPikoOldConfiguration,
                                                           KostalPikoOldInverterSetup)
from modules.devices.kostal.kostal_piko_old.inverter import KostalPikoOldInverter

log = logging.getLogger(__name__)


def create_device(device_config: KostalPikoOld):
    def create_inverter_component(component_config: KostalPikoOldInverterSetup):
        return KostalPikoOldInverter(component_config, device_id=device_config.id)

    def update_components(components: Iterable[KostalPikoOldInverter]):
        response = req.get_http_session().get(device_config.configuration.url, verify=False, auth=(
            device_config.configuration.user, device_config.configuration.password), timeout=5).text
        for component in components:
            with SingleComponentUpdateContext(component.fault_state):
                component.update(response)

    return ConfigurableDevice(
        device_config=device_config,
        component_factory=ComponentFactoryByType(
            inverter=create_inverter_component,
        ),
        component_updater=MultiComponentUpdater(update_components)
    )


COMPONENT_TYPE_TO_MODULE = {
    "inverter": inverter
}


def read_legacy(component_type: str, ip_address: str, user: str, password: str, num: Optional[int]) -> None:
    url = ip_address
    # add protocol "http://" if not already specified
    if not re.search("^https?://", ip_address, re.IGNORECASE):
        url = f"http://{ip_address}"
    device_config = KostalPikoOld(
        configuration=KostalPikoOldConfiguration(url=url, user=user, password=password))
    dev = create_device(device_config)
    if component_type in COMPONENT_TYPE_TO_MODULE:
        component_config = COMPONENT_TYPE_TO_MODULE[component_type].component_descriptor.configuration_factory()
    else:
        raise Exception(
            "illegal component type " + component_type + ". Allowed values: " +
            ','.join(COMPONENT_TYPE_TO_MODULE.keys())
        )
    component_config.id = num
    dev.add_component(component_config)

    log.debug('KostalPikoOld URL: ' + url)
    log.debug('KostalPikoOld user: ' + user)
    log.debug('KostalPikoOld Passwort: ' + password)

    dev.update()


def main(argv: List[str]):
    run_using_positional_cli_args(read_legacy, argv)


device_descriptor = DeviceDescriptor(configuration_factory=KostalPikoOld)
