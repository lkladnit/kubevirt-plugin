// tslint:disable
/**
 * KubeVirt API
 * This is KubeVirt API an add-on for Kubernetes.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: kubevirt-dev@googlegroups.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { V1PersistentVolumeClaimVolumeSource } from './V1PersistentVolumeClaimVolumeSource';

/**
 *
 * @export
 * @interface V1EphemeralVolumeSource
 */
export interface V1EphemeralVolumeSource {
  /**
   *
   * @type {V1PersistentVolumeClaimVolumeSource}
   * @memberof V1EphemeralVolumeSource
   */
  persistentVolumeClaim?: V1PersistentVolumeClaimVolumeSource;
}
