public with sharing class RegistrationResponse {
    private static final Boolean SUCCESS = true;

    private static final Boolean FAILURE = false;

    @AuraEnabled
    public final Boolean isSuccess;

    @AuraEnabled
    public final Boolean isFormValid;

    @AuraEnabled
    public final Boolean isIrnFilledByUser;

    @AuraEnabled
    public Boolean isIrnSelected {get; set;}

    @AuraEnabled
    public final Boolean isIrnValid;
    
    @AuraEnabled
    public final Boolean isIrnMatchedWithEmailOrPhone;

    @AuraEnabled
    public final Boolean isPasswordValid;

    private RegistrationResponse() {
        this.isSuccess = FAILURE;
    }

    private RegistrationResponse(
        final Boolean isSuccess,
        final Boolean isFormValid,
        final Boolean isIrnSelected,
        final Boolean isIrnFilledByUser,
        final Boolean isIrnEmpty,
        final Boolean isIrnValid,
        final Boolean isIrnMatchedWithEmailOrPhone
    ) {
        this.isSuccess = isSuccess;
        this.isFormValid = isFormValid;
        this.isIrnSelected = isIrnSelected;
        this.isIrnFilledByUser = isIrnFilledByUser;
        this.isIrnValid = isIrnValid;
        this.isIrnMatchedWithEmailOrPhone = isIrnMatchedWithEmailOrPhone;
    }

    public static RegistrationResponse withSuccess(
        final Boolean isFormValid,
        final Boolean isIrnSelected,
        final Boolean isIrnFilledByUser,
        final Boolean isIrnValid,
        final Boolean isIrnEmpty,
        final Boolean isIrnMatchedWithEmailOrPhone
    ) {
        return new RegistrationResponse(
            SUCCESS,
            isFormValid,
            isIrnSelected,
            isIrnFilledByUser,
            isIrnEmpty,
            isIrnValid,
            isIrnMatchedWithEmailOrPhone
        );
    }

    public static RegistrationResponse withFailure() {
        return new RegistrationResponse();
    }
}
