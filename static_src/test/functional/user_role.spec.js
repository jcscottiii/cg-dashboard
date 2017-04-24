
import UserRoleElement from './pageobjects/user_role.element';

describe('User roles', function () {
  let cookieResult,
    userRoleElement;
  const managerXGuid = 'org-manager-x-uid-601d-48c4-9705',
    managerYGuid = 'org-manager-y-uid-601d-48c4-9705';

  describe('User role cookie test', function () {
    afterEach(function () {
      browser.deleteCookie('testing_user_role');
    });

    describe('when cookie is set and deleted', function () {
      it('should reflect the cookie content', function () {
        browser.url('/');
        browser.setCookie({ name: 'testing_user_role', value: 'space_manager_space_xx' });
        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe('space_manager_space_xx');
      });
    });
  });

  describe('Org page as org manager X', function () {
    describe('if org manager Y then they', function () {
      it('should navigates to org Y ', function () {
        browser.url('/#/org/user_role-org_y-ffe7-4aa8-8e85-94768d6bd250');

        browser.waitForExist('.test-users');

        userRoleElement = new UserRoleElement(
          browser,
          browser.element('.test-users')
        );

        expect(userRoleElement.isVisible()).toBe(true);
      });

      it('should not be able to edit roles for org Y', function () {
        expect(userRoleElement.isUserOrgManager(managerXGuid)).toBe(false);
        expect(userRoleElement.isUserOrgManager(managerYGuid)).toBe(true);
      });
    });

    describe('if manager for org X then they', function () {
      it('should navigates to org X ', function () {
        browser.url('/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250');

        browser.waitForExist('.test-users');

        userRoleElement = new UserRoleElement(
          browser,
          browser.element('.test-users')
        );

        expect(userRoleElement.isVisible()).toBe(true);
      });

      it('should be able to edit roles for org X', function () {
        expect(userRoleElement.isUserOrgManager(managerXGuid)).toBe(true);
        expect(userRoleElement.isUserOrgManager(managerYGuid)).toBe(false);
      });
    });
  });

  describe('Testing user roles', function () {
    afterEach(function () {
      browser.deleteCookie('testing_user_role');
    });

    describe('On page for org x', function () {
      it('as org manager y should not have permission to edit fields', function() {
        browser.url('/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250');
        browser.setCookie({ name: 'testing_user_role', value: 'org_manager_org_y' });

        browser.url('/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250');
        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe('org_manager_org_y');

        const firstUserRoleControl = browser.isEnabled('.test-user-role-control input')[0];

        expect(firstUserRoleControl).toBe(false);
      });

      it('as org manager x should have permission to edit fields', function() {
        browser.url('/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250');
        browser.setCookie({ name: 'testing_user_role', value: 'org_manager_org_x' });

        browser.url('/#/org/user_role-org_x-ffe7-4aa8-8e85-94768d6bd250');
        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe('org_manager_org_x');

        const firstUserRoleControl = browser.isEnabled('.test-user-role-control input')[0];

        expect(firstUserRoleControl).toBe(true);
      });
    });

    describe('On page for org y', function () {
      it('as org manager x should not have permission to edit fields', function() {
        browser.url('/#/org/user_role-org_y-ffe7-4aa8-8e85-94768d6bd250');
        browser.setCookie({ name: 'testing_user_role', value: 'org_manager_org_x' });
        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe('org_manager_org_x');

        browser.url('/#/org/user_role-org_y-ffe7-4aa8-8e85-94768d6bd250');
        const firstUserRoleControl = browser.isEnabled('.test-user-role-control input')[0];

        expect(firstUserRoleControl).toBe(false);
      });

      it('as org manager y should have permission to edit fields', function() {
        browser.url('/#/org/user_role-org_y-ffe7-4aa8-8e85-94768d6bd250');
        browser.setCookie({ name: 'testing_user_role', value: 'org_manager_org_y' });
        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe('org_manager_org_y');

        browser.url('/#/org/user_role-org_y-ffe7-4aa8-8e85-94768d6bd250');
        const firstUserRoleControl = browser.isEnabled('.test-user-role-control input')[0];

        expect(firstUserRoleControl).toBe(true);
      });
    });
  });

  describe('Space page', function () {
    beforeEach(function () {
      const orgGuid = 'user_role-org_x-ffe7-4aa8-8e85-94768d6bd250';
      const spaceGuid = 'user_role-org_x-space_xx-4064-82f2-d74df612b794';

      browser.url(`/#/org/${orgGuid}/spaces/${spaceGuid}`);
    });

    it('navigates to a org\'s space page', function () {
      browser.waitForExist('.test-page-header-title', 2000);
      const pageHeader = browser.element('.test-page-header-title');
      expect(pageHeader.getText()).toBe('user_role-org_x-space_xx');
    });

    describe('space manager for space XX then they should', function () {
      it('be able to edit roles for space XX', function () {
        browser.setCookie({ name: 'testing_user_role', value: 'space_manager_space_xx' });
        browser.url('/uaa/userinfo');
        cookieResult = browser.getCookie('testing_user_role').value;
        expect(cookieResult).toBe('space_manager_space_xx');

        browser.deleteCookie('testing_user_role');
        browser.url('/uaa/userinfo');
        cookieResult = browser.getCookie('testing_user_role');

        expect(cookieResult).toBeFalsy();
      });

      it('not be able to edit roles for space YY', function () {
      });
    });
  });
});
