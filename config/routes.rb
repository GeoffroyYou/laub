Rails.application.routes.draw do
  root "pages#home"

  # Contact form submission
  post "contact", to: "pages#contact_submit", as: "contact"
end
