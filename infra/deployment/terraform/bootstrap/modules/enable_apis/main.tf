locals {
  enable_apis = [
    "apikeys.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudasset.googleapis.com",
    "cloudbuild.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "compute.googleapis.com",
    "deploymentmanager.googleapis.com",
    "geocoding-backend.googleapis.com",
    "identitytoolkit.googleapis.com",
    "iam.googleapis.com",
    "language.googleapis.com",
    "maps-backend.googleapis.com",
    "monitoring.googleapis.com",
    "networkmanagement.googleapis.com",
    "orgpolicy.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "servicenetworking.googleapis.com",
    "serviceusage.googleapis.com",
    "sourcerepo.googleapis.com",
    "sqladmin.googleapis.com",
    "vision.googleapis.com",
    "vpcaccess.googleapis.com"
  ]
}

resource "google_project_service" "enable_apis" {
  for_each                   = toset(local.enable_apis)
  service                    = each.value
  disable_dependent_services = true
  disable_on_destroy         = true
}
