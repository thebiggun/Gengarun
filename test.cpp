#include <bits/stdc++.h>
using namespace std;

class Solution
{
public:
    void printHollowDiamond(int n)
    {
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n - 1 - i; j++)
            {
                cout << " ";
            }

            cout << "*";

            if (i != 0)
            {
                for (int j = 0; j < 2 * i - 1; j++)
                {
                    cout << " ";
                }
                cout << "*";
            }

            cout << endl;
        }

        for (int i = n - 2; i >= 0; i--)
        {
            for (int j = 0; j < n - 1 - i; j++)
            {
                cout << " ";
            }

            cout << "*";

            if (i != 0)
            {
                for (int j = 0; j < (2 * i) - 1; j++)
                {
                    cout << " ";
                }
                cout << "*";
            }
            cout << endl;
        }
    }
};