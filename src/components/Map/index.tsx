import config, { IMapProps } from './Map.config';
import { T4DComponent, useEnhancedEditor } from '@ws-ui/webform-editor';
import Build from './Map.build';
import Render from './Map.render';

const Map: T4DComponent<IMapProps> = (props) => {
  const { enabled } = useEnhancedEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return enabled ? <Build {...props} /> : <Render {...props} />;
};

Map.craft = config.craft;
Map.info = config.info;
Map.defaultProps = config.defaultProps;

export default Map;
