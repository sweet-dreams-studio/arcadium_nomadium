import { Container, Provider } from "typescript-ioc";
import { CpuMonitor } from "./cpuMonitor";
import { ConfigurationService } from "../configuration/configuration";

export const CpuMonitorProvider: Provider = {
  get: () => {
    const configurationService: ConfigurationService = Container.get(ConfigurationService);
    return new CpuMonitor(
      configurationService.configuration.monitoring.secondsInterval + 1000
    );
  }
};
