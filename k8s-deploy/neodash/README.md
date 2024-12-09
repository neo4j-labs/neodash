# NeoDash

![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.16.0](https://img.shields.io/badge/AppVersion-1.16.0-informational?style=flat-square)

A NeoDash Helm chart for Kubernetes

## Resources

Following are the Kubernetes resources utilized for the NeoDash.

- Deployment
- Service
- Ingress
- Service Account
- Horizontal Pod Autoscalar (HPA)

## Values Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| autoscaling.enabled | bool | `false` | Enable/disable Autoscaling |
| enable_reader_mode | bool | `true` | Enable/disable Reader mode |
| envFromSecrets | list | `[]` | Environment variables from secrets |
| fullnameOverride | string | `"neodash-test"` | Name override applies to all resources |
| image.pullPolicy | string | `"IfNotPresent"` | Image pull policy |
| image.repository | string | `"neo4jlabs/neodash"` |  Image repository and Image name |
| image.tag | string | `"latest"` | Image version |
| imagePullSecrets | list | `[]` | Image pull secrets if any |
| podAnnotations | object | `{}` | Pod annotations |
| podLabels | object | `{}` | Additional labels |
| podSecurityContext | object | `{}` | Security Context if any |
| ingress.annotations | object | `{}` | Ingress Annotations for load balancers |
| ingress.className | string | `"alb"` | Ingress Class |
| ingress.enabled | bool | `false` | Enable/disable Ingress |
| ingress.hosts | list | `[]` | Host Details |
| ingress.tls | list | `[]` | TLS details |
| livenessProbe.httpGet.path | string | `"/*"` | LivenessProbe path |
| livenessProbe.httpGet.port | int | `5005` | LivenessProbe port |
| readinessProbe.httpGet.path | string | `"/*"` | Readiness path |
| readinessProbe.httpGet.port | int | `5005` | Readiness port |
| replicaCount | int | `1` | Replica count |
| resources.limits.cpu | string | `"500m"` | CPU limit |
| resources.limits.memory | string | `"128Mi"` | Memory limit |
| resources.requests.cpu | string | `"250m"` | CPU request |
| resources.requests.memory | string | `"64Mi"` | Memory request |
| service.annotations | object | `{}` | Service annotations |
| service.port | int | `5005` | Service port |
| service.targetPort | int | `5005` | Service target port |
| service.type | string | `"LoadBalancer"` | Type of service, other options are `ClusterIP` or `NodePort`  |
| serviceAccount.automount | bool | `true` | Enable/disable service account auto mount to pod |
| serviceAccount.create | bool | `true` | Enable/disable service account |
| volumeMounts | list | `[]` | Volume mounts on pod |
| volumes | list | `[]` | Volumes for pod |
| env | list |<br><pre lang="YAML">- name: "ssoEnabled" &#13;  value: "false" &#13;- name: "standalone" &#13;  value: "true" &#13;- name: "standaloneProtocol" &#13;  value: "neo4j+s" &#13;- name: "standaloneHost" &#13;  value: "localhost" &#13;- name: "standalonePort" &#13;  value: "7687" &#13;- name: "standaloneDatabase" &#13;  value: "neo4j" &#13;- name: "standaloneDashboardName" &#13;  value: "test" &#13;- name: "standaloneDashboardDatabase" &#13;  value: "neo4j" &#13;- name: "standaloneAllowLoad" &#13;  value: "false" &#13;- name: "standaloneLoadFromOtherDatabases" &#13;  value: "false" &#13;- name: "standaloneMultiDatabase" &#13;  value: "false" &#13;</pre> | Env variables for reader mode |

## Usage

- To install this helm chart run the following command,

    ```bash
    helm install <release-name> ./neodash -n <namespace-name>
    ```

- To upgrade the release run the following command,

    ```bash
    helm upgrade <release-name> ./neodash -n <namespace-name>
    ```

- To uninstall the release run the following command,

    ```bash
    helm uninstall <release-name> -n <namespace-name>
    ```

> **Note:** To use custom values files, pass `-f <path-to-values-file>.yaml` for the above command.
> **Note:** To use custom values, pass `--set param=value` for the above command.
For example, to install neodash and set the service type to NodePort, run: `helm install <release-name> ./neodash -n <namespace-name> --set service.type=NodePort`
