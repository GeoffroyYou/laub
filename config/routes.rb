Rails.application.routes.draw do
  root "pages#home"

  post "contact", to: "pages#contact_submit", as: "contact"

  # Route for Chinese page
  get "chinese", to: "pages#chinese", as: "chinese"
end
